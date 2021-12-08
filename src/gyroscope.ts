type OrientationData = {
  x: number | null;
  y: number | null;
  z: number | null;
  initial: { x: number | null; y: number | null; z: number | null };
  ready: boolean;
};

export const orientationData: OrientationData = {
  x: null,
  y: null,
  z: null,
  initial: {
    x: null,
    y: null,
    z: null,
  },
  ready: false,
};

// function handleOrientation(event: DeviceOrientationEvent) {
//   var x = event.beta; // In degree in the range [-180,180)
//   var y = event.gamma; // In degree in the range [-90,90)
//   var z = event.alpha; // In degree in the range [0, 360)

//   orientationData.x = x;
//   orientationData.y = y;
//   orientationData.z = z;

//   if (
//     orientationData.ready &&
//     orientationData.x !== null &&
//     orientationData.initial.x !== null &&
//     orientationData.y !== null &&
//     orientationData.initial.y !== null &&
//     orientationData.z !== null &&
//     orientationData.initial.z !== null
//   ) {
//     console.log(
//       "initial",
//       orientationData.initial.x,
//       orientationData.initial.y,
//       orientationData.initial.z
//     );
//     console.log(
//       "current",
//       orientationData.x,
//       orientationData.y,
//       orientationData.z
//     );
//     const dx = orientationData.initial.x - orientationData.x;
//     const dy = orientationData.initial.y - orientationData.y;
//     const dz = orientationData.initial.z - orientationData.z;

//     document.getElementById("debug")!.innerText = `${dx.toFixed(
//       2
//     )} ${dy.toFixed(2)} ${dz.toFixed(2)}`;
//   }

//   if (!orientationData.ready) {
//     orientationData.ready = true;
//     orientationData.initial.x = x;
//     orientationData.initial.y = x;
//     orientationData.initial.z = x;
//   }
// }

// window.addEventListener("deviceorientation", handleOrientation);
