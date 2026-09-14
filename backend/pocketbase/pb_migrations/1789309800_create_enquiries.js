/// <reference path="../types.d.ts" />

migrate(
  (app) => {
    try {
      app.findCollectionByNameOrId("enquiries");
      return;
    } catch (_) {}

    const collection = new Collection({
      type: "base",
      name: "enquiries",
      // Public demo/enquiry form: anyone may submit, only superusers read.
      listRule: null,
      viewRule: null,
      createRule: "",
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: "name", type: "text", required: true, max: 120 },
        { name: "email", type: "email", required: true },
        { name: "company", type: "text", required: true, max: 160 },
        {
          name: "company_type",
          type: "select",
          required: true,
          maxSelect: 1,
          values: [
            "importer",
            "exporter",
            "manufacturer",
            "logistics",
            "customs_broker",
            "other",
          ],
        },
        { name: "message", type: "text", max: 2000 },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
      indexes: ["CREATE INDEX idx_enquiries_created ON enquiries (created)"],
    });
    app.save(collection);
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("enquiries");
      app.delete(collection);
    } catch (e) {
      if (e.message.includes("no rows in result set")) {
        console.log("Collection not found, skipping revert");
        return;
      }
      throw e;
    }
  },
);
