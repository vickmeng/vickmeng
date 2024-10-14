import * as THREE from 'three';
import { Subject } from 'rxjs';

export const scene = new THREE.Scene();
export const clock = new THREE.Clock();

// 创建相机
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);

export const AnimationFrameSubject = new Subject<number>();
