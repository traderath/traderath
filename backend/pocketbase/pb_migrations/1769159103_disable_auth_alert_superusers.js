/// <reference path="../types.d.ts" />
migrate((app) => {
    const superusers = app.findCollectionByNameOrId("_superusers")

    superusers.authAlert = {
        enabled: false,
    }

    app.save(superusers)
})
