import { useRef, useEffect } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { NoteInterface } from "../../types";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API;

interface props {
    note: NoteInterface;
}

const SingleNoteMap = ({ note }: props) => {
    const mapContainer = useRef<HTMLDivElement>(null);

    const defaultCoordinates =
        note && (note.location.coordinates[0] !== 0 || note.location.coordinates[1] !== 0)
            ? note.location?.coordinates
            : [23.761, 61.4978]; // Tampere, Finland;

    useEffect(() => {
        const initializeMap = async () => {
            if (!mapContainer.current) return;

            const mapInstance = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/outdoors-v12",
                center: defaultCoordinates as LngLatLike,
                zoom: 12
            });

            mapInstance.on("load", () => {
                // Add geocoder
                const geocoder = new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken as string,
                    mapboxgl: mapboxgl
                });

                mapInstance.addControl(geocoder);

                if (note.location) {
                    const coordinates: LngLatLike = note.location.coordinates;
                    const popup = new mapboxgl.Popup().setHTML(
                        `<h3><b>${note.title}</h3></b>
                                <p>${note.content}</p>`
                    );
                    new mapboxgl.Marker().setLngLat(coordinates).setPopup(popup).addTo(mapInstance);
                }
            });
        };
        initializeMap();
        // on purpose, we want to run this only once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note]);

    if (!note) {
        return null;
    }

    return (
        <div>
            <div
                className="h-100"
                ref={mapContainer}
                style={{ height: "25rem", borderRadius: 5 }}
            />
        </div>
    );
};

export default SingleNoteMap;
