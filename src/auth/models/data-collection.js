'use strict';

// THIS IS THE STRETCH GOAL ...
// It takes in a schema in the constructor and uses that instead of every collection
// being the same and requiring their own schema. That's not very DRY!

class DataCollection {

  constructor(model) {
    this.model = model;
  }

  get(id) {
    if (id) {
      return this.model.findOne({where: { id }});
    }
    else {
      return this.model.findAll({});
    }
  }

  create(record) {
    return this.model.create(record);
  }

  // intial record is grabbed and then we modify data, then return modified data
  async update(id, data) {
    let result = await this.model.findOne({ where: { id }});
    let modifiedData = await result.update(data);
    return modifiedData;
    // return this.model.findOne({ where: { id } })
    //   .then(record => record.update(data));
  }

  delete(id) {
    return this.model.destroy({ where: { id }});
  }


}

module.exports = DataCollection;
