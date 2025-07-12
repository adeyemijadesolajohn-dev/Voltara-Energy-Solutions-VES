import React, { useRef, useState, useEffect, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "./Map.scss";

// --- GRID3 Dataset URLs (NOW USING ARCGIS LINKS) ---
const GRID3_LGA_BOUNDARIES_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/NGA_LGA_Boundaries_2/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_WARD_BOUNDARIES_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/NGA_Ward_Boundaries/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_STATE_BOUNDARIES_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/NGA_State_Boundaries_V2/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_MARKETS_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/Markets_in_Nigeria/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_CHURCHES_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/Churches_in_Nigeria/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_FIRE_STATIONS_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/GRID3_NGA_Fire_Stations/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_IDP_SITES_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/IDP_sites_in_Nigeria/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_POLICE_STATIONS_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/GRID3_NGA_Police_Stations/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_GOVERNMENT_BUILDINGS_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/GRID3_NGA_Government_Buildings/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_FILLING_STATIONS_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/Map/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson"; // Note: Named "Map" in URL
const GRID3_POST_OFFICES_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/GRID3_NGA_Post_Offices/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_FACTORIES_INDUSTRIAL_SITES_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/Factories_and_industrial_sites_in_Nigeria/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_ENERGY_SUBSTATIONS_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/Energy_and_electricity_substations_in_Nigeria/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_HEALTH_FACILITIES_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/GRID3_NGA_health_facilities_v2_0/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_SCHOOLS_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/Schools_in_Nigeria/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_MOSQUES_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/Mosques_in_Nigeria/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_SETTLEMENT_EXTENTS_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/GRID3_NGA_settlement_extents_v3_1_gdb/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";
const GRID3_SETTLEMENT_POINTS_URL =
  "https://services3.arcgis.com/BU6Aadhn6tbBEdyk/arcgis/rest/services/Settlements_in_Nigeria/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

// --- Icon Components ---
const BurgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);
const OptionsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1.51-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);
const OverlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2a10 10 0 0 0 9.22 13.91"></path>
    <path d="M12 2a10 10 0 0 1-9.22 13.91"></path>
    <path d="M12 2a10 10 0 0 0 0 20"></path>
    <path d="M12 2a10 10 0 0 1 0 20"></path>
  </svg>
);

// Custom marker icon setup for Leaflet (important for default markers to show)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map() {
  // --- Refs for Leaflet map instance and DOM elements ---
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const tooltipRef = useRef(null); // For hover tooltips
  const searchTimeoutRef = useRef(null); // For debouncing search

  // --- Refs for Leaflet GeoJSON layers to control their visibility ---
  const statesLayerRef = useRef(null);
  const lgasLayerRef = useRef(null);
  const wardsLayerRef = useRef(null);
  const marketsLayerRef = useRef(null);
  const churchesLayerRef = useRef(null);
  const fireStationsLayerRef = useRef(null);
  const idpSitesLayerRef = useRef(null);
  const policeStationsLayerRef = useRef(null);
  const governmentBuildingsLayerRef = useRef(null);
  const fillingStationsLayerRef = useRef(null);
  const postOfficesLayerRef = useRef(null);
  const factoriesIndustrialSitesLayerRef = useRef(null);
  const energySubstationsLayerRef = useRef(null);
  const healthFacilitiesLayerRef = useRef(null);
  const schoolsLayerRef = useRef(null);
  const mosquesLayerRef = useRef(null);
  const settlementExtentsLayerRef = useRef(null);
  const settlementPointsLayerRef = useRef(null);

  // Base map layer refs
  const streetTilesRef = useRef(null);
  const satelliteTilesRef = useRef(null);

  // --- State variables for GeoJSON data ---
  // Storing features directly for client-side search
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [wards, setWards] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [churches, setChurches] = useState([]);
  const [fireStations, setFireStations] = useState([]);
  const [idpSites, setIdpSites] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [governmentBuildings, setGovernmentBuildings] = useState([]);
  const [fillingStations, setFillingStations] = useState([]);
  const [postOffices, setPostOffices] = useState([]);
  const [factoriesIndustrialSites, setFactoriesIndustrialSites] = useState([]);
  const [energySubstations, setEnergySubstations] = useState([]);
  const [healthFacilities, setHealthFacilities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [mosques, setMosques] = useState([]);
  const [settlementExtents, setSettlementExtents] = useState([]);
  const [settlementPoints, setSettlementPoints] = useState([]);

  // --- UI State variables ---
  const [mapSidebarOpen, setMapSidebarOpen] = useState(false);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // --- Layer visibility state (Initial state: only states checked) ---
  const [layerVisibility, setLayerVisibility] = useState({
    // Base Maps
    osmStreets: true,
    darkSatellite: false,

    // GRID3 Overlay Layers (only States initially checked)
    statesLayer: true,
    lgasLayer: false,
    wardsLayer: false,
    marketsLayer: false,
    churchesLayer: false,
    fireStationsLayer: false,
    idpSitesLayer: false,
    policeStationsLayer: false,
    governmentBuildingsLayer: false,
    fillingStationsLayer: false,
    postOfficesLayer: false,
    factoriesIndustrialSitesLayer: false,
    energySubstationsLayer: false,
    healthFacilitiesLayer: false,
    schoolsLayer: false,
    mosquesLayer: false,
    settlementExtentsLayer: false,
    settlementPointsLayer: false,
  });

  // Toggle overlay layer visibility
  const toggleLayer = useCallback((layerId) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  }, []);

  // --- Helper function to fetch JSON data from a given URL ---
  const fetchJson = useCallback(async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} from ${url}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch from ${url}: ${error.message}`);
      return null;
    }
  }, []);

  // --- Tooltip functions for showing/hiding pop-up info on hover ---
  const showTooltip = useCallback((e, text) => {
    if (!tooltipRef.current) {
      const d = document.createElement("div");
      d.className = "map-tooltip";
      document.body.appendChild(d);
      tooltipRef.current = d;
    }
    tooltipRef.current.innerText = text;
    tooltipRef.current.style.left = `${e.originalEvent.pageX + 10}px`;
    tooltipRef.current.style.top = `${e.originalEvent.pageY + 10}px`;
    tooltipRef.current.style.opacity = 1;
  }, []);

  const hideTooltip = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = 0;
    }
  }, []);

  // --- Effect to load all GRID3 GeoJSON data ---
  useEffect(() => {
    const loadAllGrid3Data = async () => {
      // 1. Administrative Boundaries
      const stateData = await fetchJson(GRID3_STATE_BOUNDARIES_URL);
      if (stateData && stateData.features) setStates(stateData.features);
      else console.warn("GRID3 State Boundaries data not loaded or invalid.");

      const lgaData = await fetchJson(GRID3_LGA_BOUNDARIES_URL);
      if (lgaData && lgaData.features) setLgas(lgaData.features);
      else console.warn("GRID3 LGA Boundaries data not loaded or invalid.");

      const wardData = await fetchJson(GRID3_WARD_BOUNDARIES_URL);
      if (wardData && wardData.features) setWards(wardData.features);
      else console.warn("GRID3 Ward Boundaries data not loaded or invalid.");

      // 2. POIs & Facilities
      const marketsData = await fetchJson(GRID3_MARKETS_URL);
      if (marketsData && marketsData.features) setMarkets(marketsData.features);
      else console.warn("GRID3 Markets data not loaded or invalid.");

      const churchesData = await fetchJson(GRID3_CHURCHES_URL);
      if (churchesData && churchesData.features)
        setChurches(churchesData.features);
      else console.warn("GRID3 Churches data not loaded or invalid.");

      const fireStationsData = await fetchJson(GRID3_FIRE_STATIONS_URL);
      if (fireStationsData && fireStationsData.features)
        setFireStations(fireStationsData.features);
      else console.warn("GRID3 Fire Stations data not loaded or invalid.");

      const idpSitesData = await fetchJson(GRID3_IDP_SITES_URL);
      if (idpSitesData && idpSitesData.features)
        setIdpSites(idpSitesData.features);
      else console.warn("GRID3 IDP Sites data not loaded or invalid.");

      const policeStationsData = await fetchJson(GRID3_POLICE_STATIONS_URL);
      if (policeStationsData && policeStationsData.features)
        setPoliceStations(policeStationsData.features);
      else console.warn("GRID3 Police Stations data not loaded or invalid.");

      const governmentBuildingsData = await fetchJson(
        GRID3_GOVERNMENT_BUILDINGS_URL
      );
      if (governmentBuildingsData && governmentBuildingsData.features)
        setGovernmentBuildings(governmentBuildingsData.features);
      else
        console.warn("GRID3 Government Buildings data not loaded or invalid.");

      const fillingStationsData = await fetchJson(GRID3_FILLING_STATIONS_URL);
      if (fillingStationsData && fillingStationsData.features)
        setFillingStations(fillingStationsData.features);
      else console.warn("GRID3 Filling Stations data not loaded or invalid.");

      const postOfficesData = await fetchJson(GRID3_POST_OFFICES_URL);
      if (postOfficesData && postOfficesData.features)
        setPostOffices(postOfficesData.features);
      else console.warn("GRID3 Post Offices data not loaded or invalid.");

      const factoriesData = await fetchJson(
        GRID3_FACTORIES_INDUSTRIAL_SITES_URL
      );
      if (factoriesData && factoriesData.features)
        setFactoriesIndustrialSites(factoriesData.features);
      else
        console.warn(
          "GRID3 Factories & Industrial Sites data not loaded or invalid."
        );

      const energySubstationsData = await fetchJson(
        GRID3_ENERGY_SUBSTATIONS_URL
      );
      if (energySubstationsData && energySubstationsData.features)
        setEnergySubstations(energySubstationsData.features);
      else
        console.warn(
          "GRID3 Energy & Electricity Substations data not loaded or invalid."
        );

      const healthFacilitiesData = await fetchJson(GRID3_HEALTH_FACILITIES_URL);
      if (healthFacilitiesData && healthFacilitiesData.features)
        setHealthFacilities(healthFacilitiesData.features);
      else console.warn("GRID3 Health Facilities data not loaded or invalid.");

      const schoolsData = await fetchJson(GRID3_SCHOOLS_URL);
      if (schoolsData && schoolsData.features) setSchools(schoolsData.features);
      else console.warn("GRID3 Schools data not loaded or invalid.");

      const mosquesData = await fetchJson(GRID3_MOSQUES_URL);
      if (mosquesData && mosquesData.features) setMosques(mosquesData.features);
      else console.warn("GRID3 Mosques data not loaded or invalid.");

      // 3. Settlements
      const settlementExtentsData = await fetchJson(
        GRID3_SETTLEMENT_EXTENTS_URL
      );
      if (settlementExtentsData && settlementExtentsData.features)
        setSettlementExtents(settlementExtentsData.features);
      else console.warn("GRID3 Settlement Extents data not loaded or invalid.");

      const settlementPointsData = await fetchJson(GRID3_SETTLEMENT_POINTS_URL);
      if (settlementPointsData && settlementPointsData.features)
        setSettlementPoints(settlementPointsData.features);
      else
        console.warn(
          "GRID3 Settlement Points (names) data not loaded or invalid."
        );
    };

    loadAllGrid3Data();
  }, [fetchJson]);

  // --- Effect to initialize the Leaflet map and add initial layers ---
  useEffect(() => {
    if (
      mapRef.current ||
      !mapContainerRef.current ||
      !states.length ||
      !lgas.length ||
      !wards.length
    ) {
      return;
    }

    const map = L.map(mapContainerRef.current).setView([9.082, 8.6753], 5.5);
    mapRef.current = map;

    // Remove Leaflet's default zoom control
    map.removeControl(map.zoomControl);

    // Initialize base map layers
    streetTilesRef.current = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    satelliteTilesRef.current = L.tileLayer(
      "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png",
      {
        attribution:
          '<a href="https://memomaps.de/" target="_blank">MemoMaps</a> | <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>',
        maxZoom: 18,
      }
    );

    // Add initial base layer (OSM Streets by default)
    streetTilesRef.current.addTo(map);

    // Helper function to add a GeoJSON layer to the map
    const addGeoJsonLayer = (
      data,
      styleFn,
      onEachFeatureFn,
      defaultVisibility,
      isPointLayer = false
    ) => {
      if (!data || data.length === 0) return null; // Don't create layer if no data

      const geoJsonLayer = L.geoJson(
        { type: "FeatureCollection", features: data },
        {
          style: styleFn,
          onEachFeature: onEachFeatureFn,
          pointToLayer: isPointLayer
            ? (feature, latlng) => {
                return L.circleMarker(latlng, {
                  radius: 5,
                  fillColor: "#00cec9",
                  color: "#fff",
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8,
                });
              }
            : undefined,
        }
      );
      if (defaultVisibility) geoJsonLayer.addTo(map);
      return geoJsonLayer;
    };

    // --- Admin Boundary Layers ---
    statesLayerRef.current = addGeoJsonLayer(
      states,
      () => ({ color: "#333", weight: 1.5, opacity: 0.8, fillOpacity: 0 }),
      (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            e.target.setStyle({ weight: 3 });
            showTooltip(
              e,
              `State: ${
                feature.properties.state ||
                feature.properties.State ||
                feature.properties.NAME ||
                "Unnamed State"
              }`
            );
          },
          mouseout: (e) => {
            statesLayerRef.current.resetStyle(e.target);
            hideTooltip();
          },
        });
      },
      layerVisibility.statesLayer
    );

    lgasLayerRef.current = addGeoJsonLayer(
      lgas,
      () => ({
        fillColor: "#74b9ff",
        weight: 0.5,
        color: "#555",
        fillOpacity: 0.4,
        opacity: 0.7,
      }),
      (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            e.target.setStyle({ fillOpacity: 0.6, weight: 2 });
            showTooltip(
              e,
              `LGA: ${
                feature.properties.lga ||
                feature.properties.LGA ||
                feature.properties.NAME_2 ||
                "Unnamed LGA"
              }`
            );
          },
          mouseout: (e) => {
            lgasLayerRef.current.resetStyle(e.target);
            hideTooltip();
          },
          click: (e) => {
            if (e.target.getBounds) {
              map.flyToBounds(e.target.getBounds(), { padding: [50, 50] });
            }
          },
        });
      },
      layerVisibility.lgasLayer
    );

    wardsLayerRef.current = addGeoJsonLayer(
      wards,
      () => ({
        fillColor: "#a29bfe",
        weight: 0.3,
        color: "#6c5ce7",
        fillOpacity: 0.3,
        opacity: 0.6,
      }),
      (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            e.target.setStyle({ fillOpacity: 0.5, weight: 1 });
            showTooltip(
              e,
              `Ward: ${
                feature.properties.ward ||
                feature.properties.Ward ||
                feature.properties.NAME_3 ||
                "Unnamed Ward"
              }`
            );
          },
          mouseout: (e) => {
            wardsLayerRef.current.resetStyle(e.target);
            hideTooltip();
          },
        });
      },
      layerVisibility.wardsLayer
    );

    // --- Helper for POI/Point Layers ---
    const createPoiLayer = (
      data,
      color,
      visibilityKey,
      popupProps = [
        "name",
        "NAME",
        "Type",
        "FacilityName",
        "category",
        "sector",
        "status",
      ]
    ) => {
      return addGeoJsonLayer(
        data,
        () => ({
          radius: 6,
          fillColor: color,
          color: "#fff",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        }),
        (feature, layer) => {
          let popupContent = `<strong>${
            feature.properties.name || feature.properties.NAME || "Unnamed POI"
          }</strong><br/>`;
          popupProps.forEach((prop) => {
            if (feature.properties[prop]) {
              popupContent += `${prop.replace(/_/g, " ")}: ${
                feature.properties[prop]
              }<br/>`;
            }
          });
          layer.bindPopup(popupContent);
        },
        layerVisibility[visibilityKey],
        true // This is a point layer
      );
    };

    // --- POI Layers ---
    marketsLayerRef.current = createPoiLayer(
      markets,
      "#ffa500",
      "marketsLayer"
    );
    churchesLayerRef.current = createPoiLayer(
      churches,
      "#a0522d",
      "churchesLayer"
    );
    fireStationsLayerRef.current = createPoiLayer(
      fireStations,
      "#ff4500",
      "fireStationsLayer"
    );
    idpSitesLayerRef.current = createPoiLayer(
      idpSites,
      "#8b0000",
      "idpSitesLayer"
    );
    policeStationsLayerRef.current = createPoiLayer(
      policeStations,
      "#4682b4",
      "policeStationsLayer"
    );
    governmentBuildingsLayerRef.current = createPoiLayer(
      governmentBuildings,
      "#6a5acd",
      "governmentBuildingsLayer"
    );
    fillingStationsLayerRef.current = createPoiLayer(
      fillingStations,
      "#006400",
      "fillingStationsLayer"
    );
    postOfficesLayerRef.current = createPoiLayer(
      postOffices,
      "#4b0082",
      "postOfficesLayer"
    );
    factoriesIndustrialSitesLayerRef.current = createPoiLayer(
      factoriesIndustrialSites,
      "#8b4513",
      "factoriesIndustrialSitesLayer"
    );
    energySubstationsLayerRef.current = createPoiLayer(
      energySubstations,
      "#ffd700",
      "energySubstationsLayer"
    );
    healthFacilitiesLayerRef.current = createPoiLayer(
      healthFacilities,
      "#008000",
      "healthFacilitiesLayer"
    );
    schoolsLayerRef.current = createPoiLayer(
      schools,
      "#0000ff",
      "schoolsLayer"
    );
    mosquesLayerRef.current = createPoiLayer(
      mosques,
      "#696969",
      "mosquesLayer"
    );

    // --- Settlement Layers ---
    settlementExtentsLayerRef.current = addGeoJsonLayer(
      settlementExtents,
      () => ({
        fillColor: "#ffcccc",
        weight: 1,
        color: "#ff0000",
        fillOpacity: 0.2,
        opacity: 0.6,
      }),
      (feature, layer) => {
        layer.bindPopup(
          `<strong>Settlement Extent:</strong> ${
            feature.properties.name || feature.properties.NAME || "Unnamed"
          }<br/>Pop: ${
            feature.properties.population || feature.properties.POP || "N/A"
          }`
        );
      },
      layerVisibility.settlementExtentsLayer
    );

    settlementPointsLayerRef.current = createPoiLayer(
      settlementPoints,
      "#ff6347", // Tomato red
      "settlementPointsLayer",
      ["name", "NAME", "Population"]
    );

    // --- Cleanup function when component unmounts ---
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (tooltipRef.current && document.body.contains(tooltipRef.current)) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
    };
  }, [
    states,
    lgas,
    wards,
    markets,
    churches,
    fireStations,
    idpSites,
    policeStations,
    governmentBuildings,
    fillingStations,
    postOffices,
    factoriesIndustrialSites,
    energySubstations,
    healthFacilities,
    schools,
    mosques,
    settlementExtents,
    settlementPoints,
    showTooltip,
    hideTooltip, // Dependencies for map re-initialization if data changes
  ]);

  // --- Effect to manage layer visibility based on `layerVisibility` state ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateLayerVisibility = (layerRef, isVisible) => {
      if (layerRef.current) {
        if (isVisible && !map.hasLayer(layerRef.current)) {
          map.addLayer(layerRef.current);
        } else if (!isVisible && map.hasLayer(layerRef.current)) {
          map.removeLayer(layerRef.current);
        }
      }
    };

    // Base map layers
    if (layerVisibility.osmStreets) {
      if (satelliteTilesRef.current && map.hasLayer(satelliteTilesRef.current))
        map.removeLayer(satelliteTilesRef.current);
      if (streetTilesRef.current && !map.hasLayer(streetTilesRef.current))
        streetTilesRef.current.addTo(map);
    } else if (layerVisibility.darkSatellite) {
      if (streetTilesRef.current && map.hasLayer(streetTilesRef.current))
        map.removeLayer(streetTilesRef.current);
      if (satelliteTilesRef.current && !map.hasLayer(satelliteTilesRef.current))
        satelliteTilesRef.current.addTo(map);
    }

    // GRID3 Overlay Layers
    updateLayerVisibility(statesLayerRef, layerVisibility.statesLayer);
    updateLayerVisibility(lgasLayerRef, layerVisibility.lgasLayer);
    updateLayerVisibility(wardsLayerRef, layerVisibility.wardsLayer);

    updateLayerVisibility(marketsLayerRef, layerVisibility.marketsLayer);
    updateLayerVisibility(churchesLayerRef, layerVisibility.churchesLayer);
    updateLayerVisibility(
      fireStationsLayerRef,
      layerVisibility.fireStationsLayer
    );
    updateLayerVisibility(idpSitesLayerRef, layerVisibility.idpSitesLayer);
    updateLayerVisibility(
      policeStationsLayerRef,
      layerVisibility.policeStationsLayer
    );
    updateLayerVisibility(
      governmentBuildingsLayerRef,
      layerVisibility.governmentBuildingsLayer
    );
    updateLayerVisibility(
      fillingStationsLayerRef,
      layerVisibility.fillingStationsLayer
    );
    updateLayerVisibility(
      postOfficesLayerRef,
      layerVisibility.postOfficesLayer
    );
    updateLayerVisibility(
      factoriesIndustrialSitesLayerRef,
      layerVisibility.factoriesIndustrialSitesLayer
    );
    updateLayerVisibility(
      energySubstationsLayerRef,
      layerVisibility.energySubstationsLayer
    );
    updateLayerVisibility(
      healthFacilitiesLayerRef,
      layerVisibility.healthFacilitiesLayer
    );
    updateLayerVisibility(schoolsLayerRef, layerVisibility.schoolsLayer);
    updateLayerVisibility(mosquesLayerRef, layerVisibility.mosquesLayer);

    updateLayerVisibility(
      settlementExtentsLayerRef,
      layerVisibility.settlementExtentsLayer
    );
    updateLayerVisibility(
      settlementPointsLayerRef,
      layerVisibility.settlementPointsLayer
    );
  }, [layerVisibility]); // Re-run when layer visibility options change

  // --- Client-side search functionality ---
  const performSearch = useCallback(() => {
    const map = mapRef.current;
    if (!map || !searchTerm) return;

    const query = searchTerm.toLowerCase();
    const allFeatures = [
      ...states,
      ...lgas,
      ...wards,
      ...markets,
      ...churches,
      ...fireStations,
      ...idpSites,
      ...policeStations,
      ...governmentBuildings,
      ...fillingStations,
      ...postOffices,
      ...factoriesIndustrialSites,
      ...energySubstations,
      ...healthFacilities,
      ...schools,
      ...mosques,
      ...settlementExtents,
      ...settlementPoints,
    ];

    for (const feature of allFeatures) {
      const props = feature.properties;
      let found = false;
      // Define common properties to search through
      const searchableProps = [
        props.name,
        props.NAME,
        props.state,
        props.lga,
        props.ward,
        props.Type,
        props.FacilityName,
        props.category,
        props.sector,
        props.status,
        props.Population, // Add other relevant properties
      ];

      for (const propValue of searchableProps) {
        if (propValue && String(propValue).toLowerCase().includes(query)) {
          found = true;
          break;
        }
      }

      if (found) {
        // Fly to the feature. Handle points and polygons differently.
        if (
          feature.geometry.type === "Point" ||
          feature.geometry.type === "MultiPoint"
        ) {
          const latlng =
            feature.geometry.coordinates.length === 2
              ? L.latLng(
                  feature.geometry.coordinates[1],
                  feature.geometry.coordinates[0]
                )
              : null; // Handle MultiPoint by taking first point, or more complex logic
          if (latlng) {
            map.flyTo(latlng, 13); // Zoom to a reasonable level for a point
          }
        } else {
          // For polygons, try to get bounds from a temporary GeoJSON layer
          try {
            const tempLayer = L.geoJson(feature);
            if (
              tempLayer.getBounds &&
              Object.keys(tempLayer.getBounds()).length > 0
            ) {
              map.flyToBounds(tempLayer.getBounds(), { padding: [50, 50] });
            }
          } catch (error) {
            console.error("Error getting bounds for feature:", error);
          }
        }
        return; // Stop after finding the first match
      }
    }
    alert(`No results found for "${searchTerm}"`);
  }, [
    searchTerm,
    states,
    lgas,
    wards,
    markets,
    churches,
    fireStations,
    idpSites,
    policeStations,
    governmentBuildings,
    fillingStations,
    postOffices,
    factoriesIndustrialSites,
    energySubstations,
    healthFacilities,
    schools,
    mosques,
    settlementExtents,
    settlementPoints,
  ]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    // Set a new timeout to debounce search
    searchTimeoutRef.current = setTimeout(() => {
      // This will trigger performSearch via the searchTerm dependency in the useEffect below
      // or you could call performSearch() directly here if you don't want it debounced on every key stroke
    }, 500); // Debounce for 500ms
  }, []);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault(); // Prevent form default submission
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current); // Clear any pending debounced search
      }
      performSearch(); // Perform search immediately on Enter
    },
    [performSearch]
  );

  // --- Zoom controls for custom buttons ---
  const zoomIn = useCallback(() => {
    mapRef.current?.zoomIn();
  }, []);

  const zoomOut = useCallback(() => {
    mapRef.current?.zoomOut();
  }, []);

  // --- Main Render Function ---
  return (
    <div className="main-map-canvas-container">
      <div ref={mapContainerRef} className="map-main">
        {/* Search Bar */}
        <form className="search-bar-container" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search map data..."
            value={searchTerm}
            onChange={handleSearchChange}
            onBlur={performSearch} // Trigger search on blur too
          />
          <button type="submit" aria-label="Search">
            Search
          </button>
        </form>

        {/* Map Options Dropdown (Layer Toggles) */}
        <div className="map-options-dropdown-container">
          <button
            className="map-control-button options-button"
            onClick={() => setOptionsDropdownOpen(!optionsDropdownOpen)}
            aria-label="Map options"
          >
            <OptionsIcon />
          </button>
          {optionsDropdownOpen && (
            <div className="options-dropdown-content">
              <h4>Base Map</h4>
              <div className="base-map-toggles">
                <label className="layer-toggle-item">
                  <input
                    type="radio"
                    name="baseMap"
                    checked={layerVisibility.osmStreets}
                    onChange={() =>
                      setLayerVisibility((prev) => ({
                        ...prev,
                        osmStreets: true,
                        darkSatellite: false,
                      }))
                    }
                  />
                  OpenStreetMap (Streets)
                </label>
                <label className="layer-toggle-item">
                  <input
                    type="radio"
                    name="baseMap"
                    checked={layerVisibility.darkSatellite}
                    onChange={() =>
                      setLayerVisibility((prev) => ({
                        ...prev,
                        osmStreets: false,
                        darkSatellite: true,
                      }))
                    }
                  />
                  Open-source Satellite/Dark
                </label>
              </div>

              <h3>GRID3 Overlay Layers</h3>
              <div className="layer-toggles">
                {[
                  { id: "statesLayer", name: "States" },
                  { id: "lgasLayer", name: "LGAs" },
                  { id: "wardsLayer", name: "Wards" },
                  { id: "settlementPointsLayer", name: "Settlement Points" },
                  { id: "settlementExtentsLayer", name: "Settlement Extents" },
                  { id: "healthFacilitiesLayer", name: "Health Facilities" },
                  { id: "schoolsLayer", name: "Schools" },
                  { id: "marketsLayer", name: "Markets" },
                  { id: "churchesLayer", name: "Churches" },
                  { id: "mosquesLayer", name: "Mosques" },
                  { id: "fireStationsLayer", name: "Fire Stations" },
                  { id: "policeStationsLayer", name: "Police Stations" },
                  { id: "governmentBuildingsLayer", name: "Govt. Buildings" },
                  { id: "fillingStationsLayer", name: "Filling Stations" },
                  { id: "postOfficesLayer", name: "Post Offices" },
                  {
                    id: "factoriesIndustrialSitesLayer",
                    name: "Factories/Industrial",
                  },
                  { id: "energySubstationsLayer", name: "Energy Substations" },
                ].map((layer) => (
                  <label key={layer.id} className="layer-toggle-item">
                    <input
                      type="checkbox"
                      checked={layerVisibility[layer.id]}
                      onChange={() => toggleLayer(layer.id)}
                    />
                    {layer.name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Burger Menu Button (for sidebar - custom marker form) */}
        <button
          className="map-control-button burger-menu-button"
          onClick={() => setMapSidebarOpen(!mapSidebarOpen)}
          aria-label="Toggle map sidebar"
        >
          <BurgerIcon />
        </button>

        {/* Zoom Controls */}
        <div className="zoom-controls">
          <button
            className="map-control-button"
            onClick={zoomIn}
            aria-label="Zoom In"
          >
            +
          </button>
          <button
            className="map-control-button"
            onClick={zoomOut}
            aria-label="Zoom Out"
          >
            -
          </button>
        </div>

        {/* Overlay Toggle Button (placeholder) */}
        <button
          className="map-control-button overlay-toggle-button"
          onClick={() => alert("Overlay functionality not implemented yet!")}
          aria-label="Toggle overlay"
        >
          <OverlayIcon />
        </button>

        {/* Sidebar for Custom Marker Form */}
        <div
          className={`map-controls-container ${
            mapSidebarOpen ? "open" : "closed"
          }`}
        >
          <div className="map-controls-inner">
            <h3>Add Custom Marker</h3>
            <p className="sidebar-note">
              Note: This marker is for demonstration and not part of GRID3
              datasets.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const lng = parseFloat(formData.get("markerLng"));
                const lat = parseFloat(formData.get("markerLat"));
                if (!isNaN(lng) && !isNaN(lat)) {
                  alert(
                    `Custom Marker Data: Name: ${
                      formData.get("markerName") || "Unnamed"
                    }, Lat: ${lat}, Lng: ${lng}, Color: ${formData.get(
                      "markerColor"
                    )}`
                  );
                  e.target.reset();
                } else {
                  alert("Please enter valid longitude and latitude.");
                }
              }}
            >
              <input
                type="number"
                step="any"
                name="markerLng"
                placeholder="Longitude"
                required
              />
              <input
                type="number"
                step="any"
                name="markerLat"
                placeholder="Latitude"
                required
              />
              <input
                type="text"
                name="markerName"
                placeholder="Name (Optional)"
              />
              <textarea
                name="markerDescription"
                placeholder="Description (Optional)"
                rows="2"
              ></textarea>
              <input
                type="color"
                name="markerColor"
                defaultValue="#ff0000"
                title="Marker Color"
              />
              <button type="submit">Add Marker</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
