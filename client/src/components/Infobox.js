import "../stylesheets/Infobox.css";

export default function Infobox({ toggleInfoBox }) {
    return (
        <>
            <div className="popup">
                <h4 id="close" onClick={toggleInfoBox}>
                    x
                </h4>
                <div className="info-popup">
                    <img
                        id="loa-thumbnail"
                        src="../../default_pic.png"
                        alt="Loa logo"
                    />

                    <p>
                        Loa was developed by Irina Stelea as final project in
                        the Full Stack Web Development Bootcamp at Spiced
                        Academy in summer 2022. The app continued to get new
                        features after the bootcamp.
                    </p>
                    <p className="info-bold">Why Loa?</p>
                    <p>
                        "Loa" is the Icelandic word for European Golden Plover.
                        The first sighting of this bird each year is
                        traditionally associated with the coming of spring.
                    </p>
                    <p className="info-bold">Where does the data come from?</p>
                    <ul>
                        <li>
                            Bird sightings around the user's location come from
                            the eBird API owned by Cornell Lab of Ornithology.
                        </li>
                        <li>
                            The taxonomy of bird species that can be seen in
                            Germany is based on The Clements Checklist of Birds
                            of the World.
                        </li>
                        <li>Bird images come from Wikipedia.</li>
                    </ul>
                    <p className="info-bold">Get in touch</p>
                    <p>
                        Want to suggest improvements, report bugs or simply
                        share stuff?
                    </p>
                    <p>
                        Contact me at{" "}
                        <a href="mailto:irina.a.stelea@gmail.com">this email</a>
                    </p>
                </div>
            </div>
        </>
    );
}
