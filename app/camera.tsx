import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, RotateCcw, ImageIcon, Zap, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/contexts/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

export default function CameraScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const handleClose = () => {
    router.back();
  };

  const toggleCameraFacing = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        if (photo) {
          setCapturedImage(photo.uri);
        }
      } catch (error) {
        console.log('Error taking picture:', error);
      }
    }
  };

  const handlePickImage = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const handleRetake = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCapturedImage(null);
  };

  const handleConfirm = async () => {
    if (!capturedImage) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    router.replace({
      pathname: '/processing',
      params: { imageUri: capturedImage },
    });
  };

  // Loading State
  if (!permission) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="body">Loading camera...</Text>
      </Screen>
    );
  }

  // No Permission State
  if (!permission.granted) {
    return (
      <Screen style={{ padding: 24 }}>
        <TouchableOpacity style={styles.closeButtonTop} onPress={handleClose}>
          <X color={theme.colors.textPrimary} size={28} />
        </TouchableOpacity>
        
        <View style={styles.permissionContent}>
          <Text variant="h1" weight="bold" align="center" style={{ marginBottom: 12 }}>
            Camera Access Needed 📸
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} align="center" style={{ marginBottom: 32 }}>
            We need camera access to capture your beautiful selfies!
          </Text>
          
          <Button 
            label="Grant Permission" 
            onPress={requestPermission} 
            fullWidth 
            style={{ marginBottom: 16 }}
          />
          <Button 
            label="Choose from Gallery" 
            variant="secondary" 
            icon={<ImageIcon size={20} color={theme.colors.textPrimary} />}
            onPress={handlePickImage}
            fullWidth
          />
        </View>
      </Screen>
    );
  }

  // Preview State (Image Captured)
  if (capturedImage) {
    return (
      <Screen safeArea={false} style={{ backgroundColor: '#000' }}>
        <Image source={{ uri: capturedImage }} style={styles.fullScreen} />
        
        <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.pillButton} onPress={handleRetake}>
              <RotateCcw color={theme.colors.textPrimary} size={20} />
              <Text weight="semibold" style={{ marginLeft: 8 }}>Retake</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text variant="h2" weight="bold" style={{ marginBottom: 20 }}>
              Looking good? ✨
            </Text>
            <Button 
              label="Analyze My Glow" 
              icon={<Check size={20} color={theme.colors.primaryForeground} />}
              onPress={handleConfirm}
              size="l"
            />
          </View>
        </View>
      </Screen>
    );
  }

  // Camera Viewfinder State
  return (
    <View style={styles.fullScreen}>
      {Platform.OS === 'web' ? (
        <Screen style={{ justifyContent: 'center', alignItems: 'center', gap: 24 }}>
          <Text color={theme.colors.textSecondary}>Camera preview not available on web</Text>
          <Button 
            label="Choose from Gallery" 
            variant="secondary"
            icon={<ImageIcon size={20} color={theme.colors.textPrimary} />}
            onPress={handlePickImage}
          />
        </Screen>
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.fullScreen}
          facing={facing}
          mirror={facing === 'front'}
        />
      )}

      <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.circleButton} onPress={handleClose}>
            <X color={theme.colors.textPrimary} size={24} />
          </TouchableOpacity>
          <View style={styles.circleButton}>
            <Zap color={theme.colors.accent} size={20} fill={theme.colors.accent} />
          </View>
        </View>

        {/* Guide Frame */}
        <View style={styles.guideFrame}>
          <View style={[styles.corner, styles.tl, { borderColor: theme.colors.primary }]} />
          <View style={[styles.corner, styles.tr, { borderColor: theme.colors.primary }]} />
          <View style={[styles.corner, styles.bl, { borderColor: theme.colors.primary }]} />
          <View style={[styles.corner, styles.br, { borderColor: theme.colors.primary }]} />
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.sideControl} onPress={handlePickImage}>
            <ImageIcon color={theme.colors.textPrimary} size={28} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.captureButton, { borderColor: theme.colors.primary }]} onPress={handleCapture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideControl} onPress={toggleCameraFacing}>
            <RotateCcw color={theme.colors.textPrimary} size={28} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  closeButtonTop: {
    marginBottom: 40,
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  guideFrame: {
    width: 280,
    height: 340,
    alignSelf: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 4,
  },
  tl: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 24 },
  tr: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 24 },
  bl: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 24 },
  br: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 24 },
  
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 20,
  },
  sideControl: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
  },
});
