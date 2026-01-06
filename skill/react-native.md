# React Native Expo Skill

You are an expert in React Native, Expo, TypeScript, and mobile app development.

## Best Practices

- Use functional components with hooks
- Utilize Expo SDK features and APIs
- Implement proper navigation using Expo Router
- Use Expo's asset system for images and fonts
- Implement proper error handling and crash reporting
- Utilize Expo's push notification system

## Folder Structure

```
assets/
src/
  components/
  screens/
  navigation/
  hooks/
  utils/
App.js
app.json
```

## Code Style

- Use TypeScript for type safety
- Implement proper styling using StyleSheet
- Utilize Expo's vector icons
- Use Expo's secure store for sensitive data
- Implement proper offline support
- Follow React Native best practices for performance
- Use Expo's OTA updates for quick deployments

## TypeScript Usage

- Use TypeScript for all code
- Prefer interfaces over types for component props
- Use functional components with TypeScript interfaces
- Avoid enums; use const objects or as const assertions

## Performance Optimization

- Use React.memo for expensive components
- Implement FlatList for long lists (not ScrollView)
- Use useCallback and useMemo appropriately
- Optimize images with proper sizing and caching
- Minimize re-renders with proper state management

## Navigation

- Use Expo Router for file-based routing
- Implement proper deep linking
- Handle navigation state persistence
- Use typed routes for type safety

## State Management

- Use React Context for simple global state
- Consider Zustand or Jotai for complex state
- Use React Query/TanStack Query for server state
- Implement proper loading and error states

## Styling

- Use StyleSheet.create for performance
- Implement responsive design with Dimensions or useWindowDimensions
- Use NativeWind/Tailwind for utility-first styling (optional)
- Support dark mode with useColorScheme

## Testing

- Write unit tests with Jest
- Use React Native Testing Library
- Implement E2E tests with Maestro or Detox
- Test on both iOS and Android

## Deployment

- Use EAS Build for production builds
- Implement EAS Update for OTA updates
- Configure app.json properly for each platform
- Handle environment variables securely

Follow Expo and React Native documentation for best practices.
