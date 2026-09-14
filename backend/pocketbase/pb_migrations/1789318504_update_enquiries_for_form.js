/// <reference path="../types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("enquiries");

    // The live enquiry form collects company, email, phone, service_interest
    // and message. The legacy collection required `name` and `company_type`
    // (which the form no longer collects) and was missing `phone` and
    // `service_interest`. Relax the two legacy required flags and add the two
    // missing fields so the existing form submits successfully. Existing
    // records keep all their stored values.
    const nameField = collection.fields.getByName("name");
    if (nameField) nameField.required = false;

    const typeField = collection.fields.getByName("company_type");
    if (typeField) typeField.required = false;

    if (!collection.fields.getByName("phone")) {
      collection.fields.add(new TextField({ name: "phone", max: 40 }));
    }
    if (!collection.fields.getByName("service_interest")) {
      collection.fields.add(new TextField({ name: "service_interest", max: 120 }));
    }

    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("enquiries");

    const nameField = collection.fields.getByName("name");
    if (nameField) nameField.required = true;

    const typeField = collection.fields.getByName("company_type");
    if (typeField) typeField.required = true;

    if (collection.fields.getByName("phone")) {
      collection.fields.removeByName("phone");
    }
    if (collection.fields.getByName("service_interest")) {
      collection.fields.removeByName("service_interest");
    }

    app.save(collection);
  },
);
