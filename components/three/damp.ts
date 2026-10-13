// Kadr sürətindən asılı olmayan yumşaltma əmsalı: 60Hz-də kadr başına "f" qədər yaxınlaşır,
// 120Hz ekranda da eyni zaman ərzində eyni nəticə verir
export const damp = (f: number, delta: number) => 1 - Math.pow(1 - f, delta * 60);
