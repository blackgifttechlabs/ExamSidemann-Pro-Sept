import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

// Use the loader and decoder from the same Three.js release. Both are bundled
// with the application, so compressed models need no external decoder download.
const configureLabLoader = (loader: GLTFLoader) => loader.setMeshoptDecoder(MeshoptDecoder);
export function useLabAsset(url: string) {
  return useLoader(GLTFLoader, url, configureLabLoader);
}
