import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import ports from "../data/ports";
import { useQuery } from "react-query";
import { getFerries } from "../data/calls";
import ferryRoutes from "../data/ferryRoutes.json";
import { terminalIcon } from "./terminalIcon";
import { ferryIcon } from "./ferryIcon";
import { dockedFerryIcon } from "./dockedFerryIcon";
import RotatedMarker from "./RotatedMarker";
// import "leaflet-marker-rotation";
const Map = () => {
  const corner1 = L.latLng(38.523041, -71.663658);
  const corner2 = L.latLng(32.815684, -83.866225);
  const bounds = L.latLngBounds(corner1, corner2);
  const daily = {
    color: "#00cc00",
    weight: 3,
    dashArray: "20,15",
    opacity: 0.5,
    lineJoin: "round",
  };
  const {
    data: ferryData,
    status,
    error,
    isLoading,
    isError,
  } = useQuery("ferries", getFerries, {
    staleTime: 2000,
    cacheTime: 6000,
    refetchInterval: 60000,
  });
  const onEachFeature = (feature, layer) => {
    console.log("line clicked", feature);
    let routeName = feature.properties.Name;
    if (feature.properties && feature.properties.Name) {
      layer.bindPopup(routeName);
      // let popup = <Popup />;
      // layer.bindPopup(popup);
    }
  };
  return (
    <>
      <MapContainer
        doubleClickZoom={true}
        zoom={8}
        center={[35.264277, -76.833359]}
        maxBounds={bounds}
        minZoom={7}
        style={{ height: "100vh", width: "100%" }}
      >
        {/* <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, and Esri"
        />
        {ferryData &&
          ferryData.features.map((ferry) => (
            <Marker
              key={ferry.id}
              position={[
                ferry.geometry.coordinates[1],
                ferry.geometry.coordinates[0],
              ]}
              icon={
                ferry.properties.SOG === "0 knots" ? dockedFerryIcon : ferryIcon
              }
              rotationAngle={parseInt(ferry.properties.COG)}
              rotationOrigin="center"
            >
              <Popup>
                <div>
                  <h3>{ferry.properties.VesselName}</h3>
                </div>
              </Popup>
            </Marker>
          ))}
        {ports &&
          ports.map((port) => (
            <Marker
              key={port.properties.title}
              icon={terminalIcon}
              position={[
                port.geometry.coordinates[1],
                port.geometry.coordinates[0],
              ]}
            >
              <Popup>
                <div>
                  <h3>{port.properties.title}</h3>
                  <p>{port.properties.address}</p>
                  <p>{port.properties.phone}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        {ferryRoutes && (
          <GeoJSON
            pathOptions={daily}
            data={ferryRoutes}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </>
  );
};

export default Map;
