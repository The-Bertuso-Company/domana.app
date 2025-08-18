import "mapbox-gl";

declare module "mapbox-gl" {
  interface Map {
    __domanaMarkers?: mapboxgl.Marker[];
  }
}
