const request = require('request')

const geocode = (address, callback) => {
  const url =
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
    encodeURIComponent(address) +
    '.json?access_token=pk.eyJ1IjoiZ2F0YWVycyIsImEiOiJjbGQ3aTEzM2UxbHZlM3dxbGlkMTdheWxrIn0.oPJkBVxx08wcMRajVa-9eQ&limit=1'

  debugger

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to reach the location/geocode service!', undefined)
    } else if (body.features.length === 0) {
      callback(
        'Couldnot find the location. Try another search query',
        undefined
      )
    } else {
      callback(undefined, {
        latitude: body.features[0].center[0],
        longitude: body.features[0].center[1],
        location: body.features[0].place_name,
      })
    }
  })
}

module.exports = geocode
