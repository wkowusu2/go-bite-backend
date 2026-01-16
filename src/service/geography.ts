//central point for reference. It is used as the origin of the cartesian plane
const KNUST_ORIGIN = {
    lat: 6.6745,
    lng: -1.5716,
}

//size of the zone in km 
const ZONE_SIZE_KM = 1;

export function latLonToZone(lat: number, lng: number){
    //the two constants are the conversion factors for longtitude and latitude to distance(km)
    const kmPerDegreeLat = 111;
    const kmPerDegreeLng =  111 * Math.cos((KNUST_ORIGIN.lat * Math.PI) / 180);

    //getting the difference between the given given and the central point and converting that to distance
    //it is going to give the distance from the central point to the given point. 
    const changeInLatKm = (lat - KNUST_ORIGIN.lat) * kmPerDegreeLat;
    const changeInLngKm = (lng - KNUST_ORIGIN.lng) * kmPerDegreeLng;

    //finding the zone to which the given coordinate fits into
    const ZONE_X = Math.floor(changeInLatKm/ZONE_SIZE_KM);
    const ZONE_Y = Math.floor(changeInLngKm/ZONE_SIZE_KM); 
    
    return { ZONE_X, ZONE_Y}
}