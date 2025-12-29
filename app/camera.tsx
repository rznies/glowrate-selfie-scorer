import React, { useState, useRef } from 'react';
import {
  View,
  Text,
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
import Colors from '@/constants/colors';

export default function CameraScreen() {
  const router = useRouter();
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

  if (!permission) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Loading camera...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X color={Colors.text} size={28} />
        </TouchableOpacity>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Needed 📸</Text>
          <Text style={styles.permissionText}>
            We need camera access to capture your beautiful selfies!
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryButton} onPress={handlePickImage}>
            <ImageIcon color={Colors.primary} size={20} />
            <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Image source={{ uri: capturedImage }} style={styles.preview} />
        <View style={styles.previewOverlay}>
          <View style={styles.previewHeader}>
            <TouchableOpacity style={styles.previewButton} onPress={handleRetake}>
              <RotateCcw color={Colors.text} size={24} />
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.previewFooter}>
            <Text style={styles.previewTitle}>Looking good? ✨</Text>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Check color="#fff" size={28} />
              <Text style={styles.confirmText}>Analyze My Glow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackText}>Camera preview not available on web</Text>
          <TouchableOpacity style={styles.galleryButton} onPress={handlePickImage}>
            <ImageIcon color={Colors.primary} size={20} />
            <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          mirror={facing === 'front'}
        />
      )}

      <View style={[styles.overlay, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X color={Colors.text} size={28} />
          </TouchableOpacity>
          <View style={styles.flashBadge}>
            <Zap color={Colors.accent} size={18} />
          </View>
        </View>

        <View style={styles.guideFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>

        <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity style={styles.sideButton} onPress={handlePickImage}>
            <ImageIcon color={Colors.text} size={28} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideButton} onPress={toggleCameraFacing}>
            <RotateCcw color={Colors.text} size={28} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 24,
  },
  webFallbackText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideFrame: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.primary,
    borderTopLeftRadius: 20,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.primary,
    borderTopRightRadius: 20,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.primary,
    borderBottomLeftRadius: 20,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.primary,
    borderBottomRightRadius: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 48,
    paddingVertical: 32,
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  preview: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  previewHeader: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 60,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  previewButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  previewFooter: {
    alignItems: 'center',
    padding: 32,
    paddingBottom: 48,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 30,
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: Colors.background,
  },
  permissionTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  galleryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
