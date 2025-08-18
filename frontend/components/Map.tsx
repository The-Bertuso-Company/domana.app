"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type MarkerData = {
  id: number;
  longitude: number;
  latitude: number;
  label?: string; // e.g., price
};

export default function DomanaMap({ markers = [] as MarkerData[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Create map
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [121.774, 12.8797], // Philippines
      zoom: 5,
    });

    // Controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => mapRef.current?.remove();
  }, []);

  // Add markers whenever the prop changes
  useEffect(() => {
    if (!mapRef.current) return;

    // remove old markers stored on map instance (simple cleanup approach)
    // @ts-expect-error
    if (mapRef.current.__domanaMarkers) {
      // @ts-expect-error
      mapRef.current.__domanaMarkers.forEach((m: mapboxgl.Marker) => m.remove());
    }

    const created: mapboxgl.Marker[] = markers.map((m) => {
      // simple red pin with optional label
      const el = document.createElement("div");
      el.style.padding = "4px 6px";
      el.style.borderRadius = "999px";
      el.style.background = "#DA291C";
      el.style.color = "#fff";
      el.style.fontSize = "12px";
      el.style.fontWeight = "600";
      el.style.boxShadow = "0 4px 12px rgba(0,0,0,.25)";
      el.style.transform = "translateY(-4px)";
      el.textContent = m.label ?? "●";

      return new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([m.longitude, m.latitude])
        .addTo(mapRef.current!);
    });

    // @ts-expect-error
    mapRef.current.__domanaMarkers = created;
  }, [markers]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", borderRadius: 12, overflow: "hidden" }}
    />
  );
}
