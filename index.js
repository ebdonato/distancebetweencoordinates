const { Client } = require("@googlemaps/google-maps-services-js")
const express = require('express')()

//http://localhost:3000/?origin=-19.828968,-40.272855&destination=-19.820115,-40.276280

const port = process.env.PORT || 3000

function isStringOfNumber(value) {
    value = parseFloat(value)
    return typeof value === 'number' && isFinite(value)
}

express.get('/', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    console.log(request.headers.host)

    const origin = request.query.origin.split(",")
    const destination = request.query.destination.split(",")

    const coordinateA = {
        lat: origin[0],
        lng: origin[1]
    }

    const coordinateB = {
        lat: destination[0],
        lng: destination[1]
    }

    if (isStringOfNumber(coordinateA.lat) && isStringOfNumber(coordinateA.lng) && isStringOfNumber(coordinateB.lat) && isStringOfNumber(coordinateB.lng)) {
        const client = new Client({});
        client
            .distancematrix({
                params: {
                    origins: [{ ...coordinateA }],//[{ lat: a.lat, lng: -40.272855 }],
                    destinations: [{ ...coordinateB }],

                    key: process.env.GOOGLE_MAPS_API_KEY,
                },
                timeout: 1000, // milliseconds
            })
            .then((r) => {
                // https://developers.google.com/maps/documentation/distance-matrix/overview#rows


                if (r.data.rows[0].elements[0].status = "OK") {
                    response.send({
                        distance: r.data.rows[0].elements[0].distance.value,
                        duration: r.data.rows[0].elements[0].duration.value,
                        status: r.data.rows[0].elements[0].status
                    })
                }
                else {
                    response.send({
                        status: r.data.rows[0].elements[0].status
                    });
                }
            })
            .catch((e) => {
                //console.log(e.response.data.error_message);
                response.send({
                    status: e.response.data.error_message
                });
            })
    } else {
        response.send({
            status: "Erro"
        })
    }

})

//escutando
express.listen(port, () => {
    console.log(`Express listening at port: ${port}`)
})
