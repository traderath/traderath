/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    // --- Seed a demo exporter account so the app shows real data on login ---
    let demoUser;
    try {
      demoUser = app.findAuthRecordByEmail("users", "demo@rathtrade.com");
    } catch (_) {
      demoUser = new Record(users);
      demoUser.setEmail("demo@rathtrade.com");
      demoUser.setPassword("TradeRath2026!");
      demoUser.set("name", "Demo Exporter");
      demoUser.set("verified", true);
      app.save(demoUser);
    }
    const ownerId = demoUser.id;

    function getOrCreateCollection(name, def) {
      try {
        return app.findCollectionByNameOrId(name);
      } catch (_) {}
      const col = new Collection(def);
      app.save(col);
      return app.findCollectionByNameOrId(name);
    }

    const ownerField = {
      name: "owner",
      type: "relation",
      required: true,
      maxSelect: 1,
      collectionId: users.id,
      cascadeDelete: true,
    };
    const createdField = { name: "created", type: "autodate", onCreate: true, onUpdate: false };
    const updatedField = { name: "updated", type: "autodate", onCreate: true, onUpdate: true };

    const orders = getOrCreateCollection("orders", {
      type: "base",
      name: "orders",
      listRule: "@request.auth.id != '' && @request.auth.id = owner",
      viewRule: "@request.auth.id != '' && @request.auth.id = owner",
      createRule: "@request.auth.id != '' && @request.auth.id = @request.body.owner",
      updateRule: "@request.auth.id != '' && @request.auth.id = owner",
      deleteRule: "@request.auth.id != '' && @request.auth.id = owner",
      fields: [
        { name: "order_id", type: "text", required: true, max: 20 },
        { name: "customer", type: "text", required: true, max: 120 },
        { name: "country", type: "text", max: 80 },
        { name: "origin", type: "text", max: 80 },
        { name: "destination", type: "text", max: 80 },
        { name: "order_date", type: "date" },
        { name: "value", type: "number" },
        { name: "currency", type: "text", max: 8 },
        { name: "incoterm", type: "text", max: 12 },
        { name: "product", type: "text", max: 120 },
        {
          name: "status",
          type: "select",
          maxSelect: 1,
          values: ["draft", "confirmed", "processing", "ready_to_ship", "shipped", "completed"],
        },
        {
          name: "shipment_status",
          type: "select",
          maxSelect: 1,
          values: ["not_started", "booked", "in_transit", "delivered"],
        },
        {
          name: "payment_status",
          type: "select",
          maxSelect: 1,
          values: ["unpaid", "partial", "paid", "overdue"],
        },
        {
          name: "compliance_status",
          type: "select",
          maxSelect: 1,
          values: ["pending", "passed", "review", "high_risk"],
        },
        ownerField,
        createdField,
        updatedField,
      ],
    });

    const documents = getOrCreateCollection("documents", {
      type: "base",
      name: "documents",
      listRule: "@request.auth.id != '' && @request.auth.id = owner",
      viewRule: "@request.auth.id != '' && @request.auth.id = owner",
      createRule: "@request.auth.id != '' && @request.auth.id = @request.body.owner",
      updateRule: "@request.auth.id != '' && @request.auth.id = owner",
      deleteRule: "@request.auth.id != '' && @request.auth.id = owner",
      fields: [
        { name: "name", type: "text", required: true, max: 160 },
        { name: "transaction", type: "text", max: 20 },
        { name: "customer", type: "text", max: 120 },
        {
          name: "type",
          type: "select",
          maxSelect: 1,
          values: [
            "purchase_order",
            "proforma_invoice",
            "commercial_invoice",
            "packing_list",
            "certificate_of_origin",
            "shipping_instructions",
            "bill_of_lading",
            "airway_bill",
            "supporting_document",
          ],
        },
        {
          name: "verification",
          type: "select",
          maxSelect: 1,
          values: ["pending", "verified", "rejected"],
        },
        {
          name: "compliance",
          type: "select",
          maxSelect: 1,
          values: ["pending", "passed", "flag"],
        },
        ownerField,
        createdField,
        updatedField,
      ],
    });

    const complianceReviews = getOrCreateCollection("compliance_reviews", {
      type: "base",
      name: "compliance_reviews",
      listRule: "@request.auth.id != '' && @request.auth.id = owner",
      viewRule: "@request.auth.id != '' && @request.auth.id = owner",
      createRule: "@request.auth.id != '' && @request.auth.id = @request.body.owner",
      updateRule: "@request.auth.id != '' && @request.auth.id = owner",
      deleteRule: "@request.auth.id != '' && @request.auth.id = owner",
      fields: [
        { name: "order_id", type: "text", required: true, max: 20 },
        { name: "product", type: "text", max: 120 },
        { name: "origin", type: "text", max: 80 },
        { name: "destination", type: "text", max: 80 },
        {
          name: "overall_risk",
          type: "select",
          maxSelect: 1,
          values: ["low", "medium", "high"],
        },
        {
          name: "status",
          type: "select",
          maxSelect: 1,
          values: ["pending", "approved", "info_requested", "escalated"],
        },
        { name: "checks", type: "json", maxSize: 2000000 },
        { name: "notes", type: "text", max: 2000 },
        ownerField,
        createdField,
        updatedField,
      ],
    });

    const shipments = getOrCreateCollection("shipments", {
      type: "base",
      name: "shipments",
      listRule: "@request.auth.id != '' && @request.auth.id = owner",
      viewRule: "@request.auth.id != '' && @request.auth.id = owner",
      createRule: "@request.auth.id != '' && @request.auth.id = @request.body.owner",
      updateRule: "@request.auth.id != '' && @request.auth.id = owner",
      deleteRule: "@request.auth.id != '' && @request.auth.id = owner",
      fields: [
        { name: "order_id", type: "text", required: true, max: 20 },
        { name: "origin_port", type: "text", max: 80 },
        { name: "destination_port", type: "text", max: 80 },
        { name: "carrier", type: "text", max: 80 },
        { name: "forwarder", type: "text", max: 80 },
        { name: "container", type: "text", max: 40 },
        { name: "bl_awb", type: "text", max: 40 },
        { name: "etd", type: "date" },
        { name: "eta", type: "date" },
        {
          name: "status",
          type: "select",
          maxSelect: 1,
          values: ["not_started", "booking_confirmed", "documents_ready", "customs_cleared", "departed", "in_transit", "arrived", "delivered"],
        },
        { name: "timeline", type: "json", maxSize: 2000000 },
        ownerField,
        createdField,
        updatedField,
      ],
    });

    const payments = getOrCreateCollection("payments", {
      type: "base",
      name: "payments",
      listRule: "@request.auth.id != '' && @request.auth.id = owner",
      viewRule: "@request.auth.id != '' && @request.auth.id = owner",
      createRule: "@request.auth.id != '' && @request.auth.id = @request.body.owner",
      updateRule: "@request.auth.id != '' && @request.auth.id = owner",
      deleteRule: "@request.auth.id != '' && @request.auth.id = owner",
      fields: [
        { name: "order_id", type: "text", required: true, max: 20 },
        { name: "customer", type: "text", max: 120 },
        { name: "invoice_amount", type: "number" },
        { name: "received", type: "number" },
        { name: "outstanding", type: "number" },
        { name: "overdue", type: "number" },
        { name: "currency", type: "text", max: 8 },
        { name: "due_date", type: "date" },
        {
          name: "status",
          type: "select",
          maxSelect: 1,
          values: ["unpaid", "partial", "paid", "overdue"],
        },
        ownerField,
        createdField,
        updatedField,
      ],
    });

    // --- Seed data ---
    const SEED = [
      {
        order_id: "EXP-1024", customer: "ABC GmbH", country: "Germany", origin: "Mumbai", destination: "Hamburg",
        order_date: "2026-08-14", value: 75000, currency: "USD", incoterm: "FOB", product: "Industrial Sensor",
        status: "confirmed", shipment_status: "booked", payment_status: "partial", compliance_status: "review", risk: "medium",
        docs: [
          { name: "PO-ABC-1024.pdf", type: "purchase_order", verification: "verified", compliance: "passed" },
          { name: "CI-EXP-1024.pdf", type: "commercial_invoice", verification: "verified", compliance: "passed" },
          { name: "PL-EXP-1024.pdf", type: "packing_list", verification: "pending", compliance: "pending" },
        ],
        shipment: { origin_port: "Mumbai (INBOM)", destination_port: "Hamburg (DEHAM)", carrier: "Maersk Line", forwarder: "Blue Anchor Logistics", container: "MSCU-7741230", bl_awb: "MAEU-2204117", etd: "2026-09-02", eta: "2026-10-04", status: "in_transit" },
        payment: { invoice_amount: 75000, received: 30000, outstanding: 45000, overdue: 0, due_date: "2026-10-04", status: "partial" },
      },
      {
        order_id: "EXP-1025", customer: "TechMart LLC", country: "United States", origin: "Chennai", destination: "Los Angeles",
        order_date: "2026-08-20", value: 42000, currency: "USD", incoterm: "CIF", product: "Cotton Textiles",
        status: "processing", shipment_status: "booked", payment_status: "unpaid", compliance_status: "pending", risk: "low",
        docs: [
          { name: "PO-TM-5521.pdf", type: "purchase_order", verification: "verified", compliance: "passed" },
          { name: "PI-EXP-1025.pdf", type: "proforma_invoice", verification: "verified", compliance: "passed" },
        ],
        shipment: { origin_port: "Chennai (INMAA)", destination_port: "Los Angeles (USLAX)", carrier: "CMA CGM", forwarder: "Blue Anchor Logistics", container: "CMAU-9980122", bl_awb: "CMDU-4477120", etd: "2026-09-10", eta: "2026-10-20", status: "documents_ready" },
        payment: { invoice_amount: 42000, received: 0, outstanding: 42000, overdue: 0, due_date: "2026-10-20", status: "unpaid" },
      },
      {
        order_id: "EXP-1026", customer: "Nakamura Corp", country: "Japan", origin: "Mundra", destination: "Yokohama",
        order_date: "2026-08-25", value: 96000, currency: "USD", incoterm: "FOB", product: "Auto Components",
        status: "ready_to_ship", shipment_status: "not_started", payment_status: "partial", compliance_status: "passed", risk: "low",
        docs: [
          { name: "PO-NK-3309.pdf", type: "purchase_order", verification: "verified", compliance: "passed" },
          { name: "CI-EXP-1026.pdf", type: "commercial_invoice", verification: "verified", compliance: "passed" },
          { name: "COO-EXP-1026.pdf", type: "certificate_of_origin", verification: "verified", compliance: "passed" },
          { name: "PL-EXP-1026.pdf", type: "packing_list", verification: "verified", compliance: "passed" },
        ],
        shipment: { origin_port: "Mundra (INMUN)", destination_port: "Yokohama (JPYOK)", carrier: "ONE Line", forwarder: "Indo Freight", container: "ONEU-1200987", bl_awb: "", etd: "2026-09-15", eta: "2026-10-18", status: "booking_confirmed" },
        payment: { invoice_amount: 96000, received: 48000, outstanding: 48000, overdue: 0, due_date: "2026-10-18", status: "partial" },
      },
      {
        order_id: "EXP-1027", customer: "Boucherie Paris", country: "France", origin: "Nhava Sheva", destination: "Le Havre",
        order_date: "2026-08-28", value: 31000, currency: "EUR", incoterm: "CIF", product: "Leather Goods",
        status: "shipped", shipment_status: "in_transit", payment_status: "unpaid", compliance_status: "passed", risk: "low",
        docs: [
          { name: "PO-BP-204.pdf", type: "purchase_order", verification: "verified", compliance: "passed" },
          { name: "CI-EXP-1027.pdf", type: "commercial_invoice", verification: "verified", compliance: "passed" },
          { name: "BL-EXP-1027.pdf", type: "bill_of_lading", verification: "verified", compliance: "passed" },
        ],
        shipment: { origin_port: "Nhava Sheva (INNSA)", destination_port: "Le Havre (FRLEH)", carrier: "Hapag-Lloyd", forwarder: "Indo Freight", container: "HLXU-5523104", bl_awb: "HLCU-2288410", etd: "2026-09-01", eta: "2026-10-12", status: "in_transit" },
        payment: { invoice_amount: 31000, received: 0, outstanding: 31000, overdue: 0, due_date: "2026-10-12", status: "unpaid" },
      },
      {
        order_id: "EXP-1028", customer: "Gulf Trading", country: "United Arab Emirates", origin: "Pipavav", destination: "Jebel Ali",
        order_date: "2026-07-30", value: 18500, currency: "USD", incoterm: "FOB", product: "Basmati Rice",
        status: "completed", shipment_status: "delivered", payment_status: "paid", compliance_status: "passed", risk: "low",
        docs: [
          { name: "PO-GT-1190.pdf", type: "purchase_order", verification: "verified", compliance: "passed" },
          { name: "CI-EXP-1028.pdf", type: "commercial_invoice", verification: "verified", compliance: "passed" },
          { name: "BL-EXP-1028.pdf", type: "bill_of_lading", verification: "verified", compliance: "passed" },
          { name: "COO-EXP-1028.pdf", type: "certificate_of_origin", verification: "verified", compliance: "passed" },
        ],
        shipment: { origin_port: "Pipavav (INPAV)", destination_port: "Jebel Ali (AEJEA)", carrier: "Emirates Shipping", forwarder: "Gulf Link", container: "ESLU-8841200", bl_awb: "ESL-1190231", etd: "2026-08-10", eta: "2026-08-17", status: "delivered" },
        payment: { invoice_amount: 18500, received: 18500, outstanding: 0, overdue: 0, due_date: "2026-08-17", status: "paid" },
      },
      {
        order_id: "EXP-1029", customer: "Andean Imports", country: "Chile", origin: "Kolkata", destination: "Valparaiso",
        order_date: "2026-09-01", value: 54000, currency: "USD", incoterm: "CIF", product: "Bulk Tea",
        status: "draft", shipment_status: "not_started", payment_status: "unpaid", compliance_status: "pending", risk: "medium",
        docs: [
          { name: "PO-AI-771.pdf", type: "purchase_order", verification: "pending", compliance: "pending" },
        ],
        shipment: { origin_port: "Kolkata (INCCU)", destination_port: "Valparaiso (CLVAP)", carrier: "", forwarder: "", container: "", bl_awb: "", etd: "", eta: "", status: "not_started" },
        payment: { invoice_amount: 54000, received: 0, outstanding: 54000, overdue: 0, due_date: "2026-11-01", status: "unpaid" },
      },
      {
        order_id: "EXP-1030", customer: "Nordic Tools", country: "Sweden", origin: "Mumbai", destination: "Gothenburg",
        order_date: "2026-08-18", value: 67000, currency: "EUR", incoterm: "FOB", product: "Hand Tools",
        status: "confirmed", shipment_status: "booked", payment_status: "partial", compliance_status: "review", risk: "medium",
        docs: [
          { name: "PO-NT-640.pdf", type: "purchase_order", verification: "verified", compliance: "passed" },
          { name: "PI-EXP-1030.pdf", type: "proforma_invoice", verification: "verified", compliance: "passed" },
          { name: "SI-EXP-1030.pdf", type: "shipping_instructions", verification: "pending", compliance: "pending" },
        ],
        shipment: { origin_port: "Mumbai (INBOM)", destination_port: "Gothenburg (SEGOT)", carrier: "MSC", forwarder: "Blue Anchor Logistics", container: "MSCU-6620117", bl_awb: "", etd: "2026-09-20", eta: "2026-10-28", status: "booking_confirmed" },
        payment: { invoice_amount: 67000, received: 20000, outstanding: 47000, overdue: 0, due_date: "2026-10-28", status: "partial" },
      },
      {
        order_id: "EXP-1031", customer: "Saharan Foods", country: "Morocco", origin: "Mundra", destination: "Casablanca",
        order_date: "2026-09-03", value: 22000, currency: "USD", incoterm: "CIF", product: "Spices",
        status: "processing", shipment_status: "booked", payment_status: "unpaid", compliance_status: "high_risk", risk: "high",
        docs: [
          { name: "PO-SF-882.pdf", type: "purchase_order", verification: "verified", compliance: "flag" },
          { name: "CI-EXP-1031.pdf", type: "commercial_invoice", verification: "pending", compliance: "flag" },
        ],
        shipment: { origin_port: "Mundra (INMUN)", destination_port: "Casablanca (MACAS)", carrier: "Arkas", forwarder: "Gulf Link", container: "ARKU-3300121", bl_awb: "", etd: "2026-09-25", eta: "2026-10-22", status: "documents_ready" },
        payment: { invoice_amount: 22000, received: 0, outstanding: 22000, overdue: 22000, due_date: "2026-09-10", status: "overdue" },
      },
    ];

    const checkNames = [
      "HS / ITC-HS Classification",
      "Party Screening",
      "Country Restrictions",
      "License Requirement",
      "Document Compliance",
      "End Use Review",
    ];
    const reviewers = ["A. Sharma", "R. Iyer", "M. Khan", "P. Nair"];

    SEED.forEach((s) => {
      // order
      let orderRec = null;
      try {
        const existing = app.findRecordsByFilter("orders", 'order_id = "' + s.order_id + '"');
        if (existing && existing.length > 0) orderRec = existing[0];
      } catch (_) {}
      if (!orderRec) {
        orderRec = new Record(orders);
        orderRec.set("order_id", s.order_id);
        orderRec.set("customer", s.customer);
        orderRec.set("country", s.country);
        orderRec.set("origin", s.origin);
        orderRec.set("destination", s.destination);
        orderRec.set("order_date", s.order_date);
        orderRec.set("value", s.value);
        orderRec.set("currency", s.currency);
        orderRec.set("incoterm", s.incoterm);
        orderRec.set("product", s.product);
        orderRec.set("status", s.status);
        orderRec.set("shipment_status", s.shipment_status);
        orderRec.set("payment_status", s.payment_status);
        orderRec.set("compliance_status", s.compliance_status);
        orderRec.set("owner", ownerId);
        app.save(orderRec);
      }

      // documents
      s.docs.forEach((d) => {
        const doc = new Record(documents);
        doc.set("name", d.name);
        doc.set("transaction", s.order_id);
        doc.set("customer", s.customer);
        doc.set("type", d.type);
        doc.set("verification", d.verification);
        doc.set("compliance", d.compliance);
        doc.set("owner", ownerId);
        app.save(doc);
      });

      // compliance review
      const checks = checkNames.map((name, i) => {
        let st = "passed";
        if (s.risk === "high" && i >= 3) st = "failed";
        else if (s.risk === "medium" && i >= 4) st = "review";
        return {
          name,
          status: st,
          confidence: st === "passed" ? 0.92 : st === "review" ? 0.74 : 0.61,
          reviewer: reviewers[i % reviewers.length],
          lastChecked: "2026-09-08",
          evidence: st === "passed" ? "Matched against WCO HS 2022 + national schedule." : "Manual review required.",
          reason: st === "passed" ? "Within permitted tolerance." : st === "review" ? "Preferential origin documentation pending." : "Counterparty watchlist match — escalate.",
        };
      });
      const cr = new Record(complianceReviews);
      cr.set("order_id", s.order_id);
      cr.set("product", s.product);
      cr.set("origin", s.origin);
      cr.set("destination", s.destination);
      cr.set("overall_risk", s.risk);
      cr.set("status", s.compliance_status === "passed" ? "approved" : s.compliance_status === "high_risk" ? "escalated" : "pending");
      cr.set("checks", checks);
      cr.set("notes", "");
      cr.set("owner", ownerId);
      app.save(cr);

      // shipment
      const timelineSteps = ["booking_confirmed", "documents_ready", "customs_cleared", "departed", "in_transit", "arrived", "delivered"];
      const statusOrder = ["not_started", "booking_confirmed", "documents_ready", "customs_cleared", "departed", "in_transit", "arrived", "delivered"];
      const currentIdx = statusOrder.indexOf(s.shipment.status);
      const timeline = timelineSteps.map((step, i) => ({
        step,
        status: i < currentIdx ? "done" : i === currentIdx ? "current" : "upcoming",
        date: i < currentIdx ? "2026-09-0" + (i + 1) : "",
      }));
      const sh = new Record(shipments);
      sh.set("order_id", s.order_id);
      sh.set("origin_port", s.shipment.origin_port);
      sh.set("destination_port", s.shipment.destination_port);
      sh.set("carrier", s.shipment.carrier);
      sh.set("forwarder", s.shipment.forwarder);
      sh.set("container", s.shipment.container);
      sh.set("bl_awb", s.shipment.bl_awb);
      sh.set("etd", s.shipment.etd);
      sh.set("eta", s.shipment.eta);
      sh.set("status", s.shipment.status);
      sh.set("timeline", timeline);
      sh.set("owner", ownerId);
      app.save(sh);

      // payment
      const pmt = new Record(payments);
      pmt.set("order_id", s.order_id);
      pmt.set("customer", s.customer);
      pmt.set("invoice_amount", s.payment.invoice_amount);
      pmt.set("received", s.payment.received);
      pmt.set("outstanding", s.payment.outstanding);
      pmt.set("overdue", s.payment.overdue);
      pmt.set("currency", s.currency);
      pmt.set("due_date", s.payment.due_date);
      pmt.set("status", s.payment.status);
      pmt.set("owner", ownerId);
      app.save(pmt);
    });
  },
  (app) => {
    ["payments", "shipments", "compliance_reviews", "documents", "orders"].forEach((name) => {
      try {
        app.delete(app.findCollectionByNameOrId(name));
      } catch (e) {
        if (e.message.includes("no rows in result set")) return;
        throw e;
      }
    });
    try {
      app.delete(app.findAuthRecordByEmail("users", "demo@rathtrade.com"));
    } catch (e) {
      if (e.message.includes("no rows in result set")) return;
      throw e;
    }
  },
);
