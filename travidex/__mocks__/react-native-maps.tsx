import { View } from 'react-native';
const MockMapView = (props: any) => <View testID="map-view">{props.children}</View>;
export const Marker = (props: any) => <View testID={`marker-${props.identifier ?? ''}`}>{props.children}</View>;
export default MockMapView;
