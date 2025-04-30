import React, { useState, useEffect } from 'react';
import { createContext } from 'use-context-selector';
import {
  PermissionStatus,
  PERMISSIONS,
  request,
  check,
} from 'react-native-permissions';
import { AppState, Platform } from 'react-native';
import useAsyncStorage from '../hooks';
import { LOCATION_PERMISSION_ASKED } from '../utils/contant';
export interface PermissionsStates {
  loading: boolean;
  locationStatus: PermissionStatus;
  appTrackingStatus?: PermissionStatus;
}

export const permissionsInitState: PermissionsStates = {
  loading: true,
  locationStatus: 'unavailable',
  appTrackingStatus: 'unavailable',
};

type PermissionsContextProps = {
  permissions: PermissionsStates;
  askLocationPermission: () => void;
  checkLocationPermission: () => void;
  askAppTrackingPermissions: () => void;
  checkAppTrackingPermissions: () => void;
  resetPermissions: () => void;
};

export const PermissionsContext = createContext({} as PermissionsContextProps);

export const PermissionsProvider = ({ children }: any) => {
  const [permissions, setPermission] = useState(permissionsInitState);
  const [_, setHasAskedLocation] = useAsyncStorage(LOCATION_PERMISSION_ASKED);
  useEffect(() => {
    AppState.addEventListener('change', state => {
      if (state !== 'active') {
        return;
      }

      checkLocationPermission();
    });
    // return ()=>{
    //   AppState.removeEventListener(Permissions)
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const resetPermissions = async () => {
    setPermission(permissionsInitState);
    // También deberías resetear el AsyncStorage aquí si es necesario
    await setHasAskedLocation(LOCATION_PERMISSION_ASKED);
  };
  const askLocationPermission = async () => {
    let permissionStatus: PermissionStatus;
    // let cameraStatus: PermissionStatus;

    if (Platform.OS === 'ios') {
      permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      // cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
    } else {
      permissionStatus = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      // cameraStatus = await request(PERMISSIONS.ANDROID.CAMERA);
    }

    setPermission({
      ...permissions,
      loading: false,
      locationStatus: permissionStatus,
    });
  };

  const checkLocationPermission = async () => {
    let permissionStatus: PermissionStatus;
    setPermission({ ...permissions, loading: true });

    if (Platform.OS === 'ios') {
      permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    setPermission({
      ...permissions,
      loading: false,
      locationStatus: permissionStatus,
    });
  };

  const askAppTrackingPermissions = async () => {
    let permissionsAppTracking: PermissionStatus;

    if (Platform.OS === 'ios') {
      permissionsAppTracking = await request(
        PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
      );
      // cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
      setPermission({
        ...permissions,
        loading: false,
        appTrackingStatus: permissionsAppTracking,
      });
    }
  };

  const checkAppTrackingPermissions = async () => {
    let permissionsAppTracking: PermissionStatus;
    if (Platform.OS === 'ios') {
      permissionsAppTracking = await check(
        PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
      );
      setPermission({
        ...permissions,
        appTrackingStatus: permissionsAppTracking,
      });
    }
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        askLocationPermission,
        checkLocationPermission,
        askAppTrackingPermissions,
        checkAppTrackingPermissions,
        resetPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};
