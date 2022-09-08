createdb birdapp

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL CHECK (first != ''),
    last VARCHAR NOT NULL CHECK (last != ''),
    email VARCHAR UNIQUE NOT NULL CHECK (email != ''),
    password VARCHAR NOT NULL CHECK (password != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE sightings(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sighting jsonb NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


create TABLE sightings_images (
   id SERIAL PRIMARY KEY,
   user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   sighting_id INTEGER NOT NULL REFERENCES sightings(id) ON DELETE CASCADE,
   image_url TEXT NOT NULL
);


-- user 1 sightings


{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                13.466653,
                52.625122
            ]
        },
        "properties": {
            "comName": "Great Spotted Woodpecker",
            "sciName": "Dendrocopos major"
        }
    }



{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                13.471460,
                52.627709
            ]
        },
        "properties": {
            "comName": "Common Wood-Pigeon",
            "sciName": "Columba palumbus"
        }
    }


{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                13.469544,
                52.624955
            ]
        },
        "properties": {
            "comName": "Mandarin Duck",
            "sciName": "Aix galericulata"
        }
    }


{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                13.457460,
                52.620164
            ]
        },
        "properties": {
            "comName": "Black-headed Gull",
            "sciName": "Chroicocephalus ridibundus"
        }
    }


    INSERT INTO sightings (user_id, sighting) 
    VALUES (1, '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [13.466653, 52.625122]},"properties": {"comName": "Great Spotted Woodpecker", "sciName": "Dendrocopos major", "date": "23/08/2022, 11:11:12"}}');

    INSERT INTO sightings (user_id, sighting) 
    VALUES (1, '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [13.471460, 52.627709]},"properties": {"comName": "Common Wood-Pigeon", "sciName": "Columba palumbus", "date": "24/08/2022, 17:22:12"}}'), (1, '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [13.469544, 52.624955]},"properties": {"comName": "Mandarin Duck", "sciName": "Aix galericulata", "date": "24/08/2022, 18:09:12"}}'), (1, '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [13.457460, 52.620164]},"properties": {"comName": "Black-headed Gull", "sciName": "Chroicocephalus ridibundus", "date": "24/08/2022, 18:21:33"}}');
