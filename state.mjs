// Keep the storage key to migrate existing marks without losing them.
export const STORAGE_KEY = 'tcg-turno:v1';
export const MARKERS = ['stadium', 'supporter', 'energy', 'active', 'bench-1', 'bench-2', 'bench-3', 'bench-4', 'bench-5'];
export const freshMarkers = () => Object.fromEntries(MARKERS.map(key => [key, false]));
export const initialState = () => ({ version: 2, markers: freshMarkers() });
function validSnapshot(value) {
  return value?.markers && MARKERS.every(key => typeof value.markers[key] === 'boolean');
}
function snapshot(value) {
  return { markers: Object.fromEntries(MARKERS.map(key => [key, value.markers[key]])) };
}
export function restoreState(serialized) {
  try {
    const value = JSON.parse(serialized);
    if (![1, 2].includes(value?.version) || !validSnapshot(value)) return initialState();
    return { version: 2, ...snapshot(value) };
  } catch { return initialState(); }
}
export function updateState(state, action) {
  switch (action.type) {
    case 'toggle':
      if (!MARKERS.includes(action.key)) return state;
      return { ...state, markers: { ...state.markers, [action.key]: !state.markers[action.key] } };
    case 'reset':
      return initialState();
    default: return state;
  }
}
