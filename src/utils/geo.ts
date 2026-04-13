export interface Coordinates {
  latitude: number
  longitude: number
}

export function isValidCoordinates({ latitude, longitude }: Coordinates) {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
}
