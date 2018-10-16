const path = require('path'),
    moment = require('moment'),
    util = require("util"),
    _fastJsonPatch = require('fast-json-patch');



// NEW
exports.new = function(data, cb) {
    let Model = new data.model(data.schema);
    Model.save(function(err, doc) {
        if (err) {
            console.log(err);
            //return cb(true, null);
            return cb(true, err);
        } else {
            result = {
                document: doc,
            };
            return cb(false, result);
        }
    });
};


// UPDATE
exports.update = function(data, cb) {


    let observer = {};
    let patches = {};
    let audit = {};
    let audit_filter = ['$__', '_doc', '$init', 'errors'];
    data.model.findOne(data.filter, function(err, doc) {
        if (err) {
            console.log("Error: " + err);
            return cb(true, null);
        } else if (doc == null) {
            return cb(false, null)
        } else {
            if (data.audit.is_audit) {
                observer = _fastJsonPatch.observe(doc);
            }
            data.model.findOneAndUpdate(data.filter, data.update, { new: true }, function(err, doc) {
                if (err) {
                    console.log(err);
                    return cb(true, null);
                }
                if (data.audit_history) {
                    patches = _fastJsonPatch.generate(observer);
                    patches.map(function(entry) {
                        let path = (0, _.tail)(entry.path.split('/')).join('.');
                        entry.newValue = (0, _.get)(doc, path);
                    });
                    audit_filter.concat(data.audit.audit_filter);
                    patches.filter(function(i) {
                        if (!new RegExp(audit_filter.join("|")).test(i.path) && i.value != i.newValue) {
                            return i.path;
                        }
                    });
                    audit = { record: doc._id, changes: patches };
                    new data.audit.model(audit).save(function(err) {
                        if (err) {
                            console.log("UPDATE ERROR: Update Audit was not generated: " + err);
                        }
                    });
                }
                result = {
                    document: doc,
                };
                return cb(false, result);
            });
        }
    });
};

// SOFT DELETE
exports.delete = function(data, cb) {
    data.update = {
        $set: {
            status: 0,
        },
        $push: {
            history: {
                by: data.user._id,
                date: moment().toDate(),
                action: 'Delete',
                code: 0
            }
        }
    };
    this.schema_update(data, function(err, doc) {
        if (err) {
            console.log("DELETE ERROR: " + err);
            return cb(true, doc);
        } else {
            return cb(false, doc);
        }
    });
};

// FILTER
exports.filter = function(data) {
    //Setting local filter variables
    let name_startsWith = data.query.name_startsWith,
        properties = data.properties,
        search = {};
    search['$or'] = [];

    //Filtering
    //It's required to send an array with all the properties the records should be filtered by,
    //if the array or search value are sent empty, no filter will be applied.
    for (let i = 0; i < properties.length; i++) {
        if ('and' === properties[i].search) {
            if ('regex' === properties[i].search_type) {
                if (!_.isEmpty(name_startsWith)) {
                    search[properties[i].field] = { $regex: ".*" + name_startsWith + ".*", '$options': 'i' };
                }
            } else {
                search[properties[i].field] = properties[i].query;
            }
        } else if ('or' === properties[i].search) {
            if ('regex' === properties[i].search_type) {
                if (!_.isEmpty(name_startsWith)) {
                    let obj = {};
                    obj[properties[i].field] = { $regex: ".*" + name_startsWith + ".*", '$options': 'i' };
                    search['$or'].push(obj);
                }
            } else {
                let obj = {};
                obj[properties[i].field] = properties[i].query;
                search['$or'].push(obj);
            }
        }
    };

    //Delete $or in case it's empty
    if (_.isEmpty(search['$or'])) {
        delete search['$or'];
    }
    console.log(search);
    return search;
};

// COUNT
exports.count = function(data, cb) {
    //Count
    //This query is required in order to generate the pagination for the JqxGrid.
    //It also determines before the aggregate if the Data we are searching for is even there.
    data.model.count(data.search, function(err, count) {
        let result = {};
        if (err) {
            console.log(err);
            return cb(true, null);
        } else {
            return cb(false, count);
        }
    });
};

// AGGREGATE
exports.aggregate = function(filter, cb) {
    let sortdatafield = filter.query.sortdatafield,
        sortoder = filter.query.sortorder,
        recordstartindex = filter.query.recordstartindex,
        pagesize = filter.query.pagesize;

    //Sorting and Ordering
    //If no order type or parameter are sent, default is to sort by ascending _id values
    let orderby = 1;
    let sortParams = {}
    if (sortoder === 'desc') orderby = -1;
    if (!_.isEmpty(sortdatafield)) {
        sortParams[sortdatafield] = orderby;
    } else {
        sortParams['_id'] = orderby;
    }

    //Aggregate
    //If we got here, that means that there is data in the database and we need to aggregate.
    //A result limit will be set regardless of pagination to avoid abuse.
    let aggregate = [];

    //Setting record start and record limit
    if (_.isNaN(recordstartindex) || _.isNull(recordstartindex) || !_.isNumber(recordstartindex)) recordstartindex = 0;
    if (_.isNaN(pagesize) || _.isNull(pagesize) || !_.isNumber(pagesize)) pagesize = 100;

    //Pushing relevant data into the aggregate
    //Match -> Sort -> Limit -> Skip -> Project
    //This order is the most efficient when we just want to list
    //Adding match later will mean more data will have to be processed!
    aggregate.push({ $match: filter.search });
    if (filter.hasOwnProperty('custom_paging') && !_.isEmpty(filter.custom_paging)) {
        aggregate.push(filter.custom_paging);
    } else {
        aggregate.push({ $sort: sortParams });
        aggregate.push({ $limit: pagesize });
        aggregate.push({ $skip: recordstartindex });
    }
    //Project is always added last and only if the function was given a list of columns to project.
    if (filter.hasOwnProperty('custom_aggregate') && !_.isEmpty(filter.custom_aggregate)) {
        aggregate.push(filter.custom_aggregate);
    };
    console.log(JSON.stringify(aggregate));
    filter.model.aggregate(aggregate, function(err, Schema) {
        let result = {};
        //callback hell - needs to be turned into proper async/await
        if (err) {
            console.log(err);
            return cb(true, null);
        } else {
            return cb(false, Schema);
        }
    });
};