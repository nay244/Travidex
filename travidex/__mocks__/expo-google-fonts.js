// Mock for all @expo-google-fonts/* packages
const useFonts = jest.fn(() => [true, null]);
module.exports = {
  useFonts,
  // font weight constants are just strings
  SpaceGrotesk_400Regular: 'SpaceGrotesk_400Regular',
  SpaceGrotesk_500Medium: 'SpaceGrotesk_500Medium',
  SpaceGrotesk_600SemiBold: 'SpaceGrotesk_600SemiBold',
  SpaceGrotesk_700Bold: 'SpaceGrotesk_700Bold',
  SpaceMono_400Regular: 'SpaceMono_400Regular',
  SpaceMono_700Bold: 'SpaceMono_700Bold',
};
