
export interface ShippingMethod {
  _id: string;
  name: string;
  deliveryTime: string;
  cost: number;
  isActive: boolean;
}

export interface DeliveryArea {
  _id: string;
  name: string;
  cost: number;
  deliveryTime: string;
  isActive: boolean;
}

export const shippingMethods: ShippingMethod[] = [
  { _id: 'sm-standard', name: 'Standard Shipping', deliveryTime: '3-5 days', cost: 5, isActive: true },
  { _id: 'sm-express', name: 'Express Shipping', deliveryTime: '1-2 days', cost: 10, isActive: false },
  { _id: 'sm-free', name: 'Free Shipping', deliveryTime: '5-7 days', cost: 0, isActive: false },
];

export const deliveryAreas: DeliveryArea[] = [
  { _id: 'da-cairo', name: 'Cairo', cost: 5, deliveryTime: '3-5 days', isActive: true },
  { _id: 'da-giza', name: 'Giza', cost: 10, deliveryTime: '1-2 days', isActive: true },
  { _id: 'da-alexandria', name: 'Alexandria', cost: 6, deliveryTime: '5-7 days', isActive: true },
  { _id: 'da-other', name: 'Other Areas', cost: 10, deliveryTime: '5-7 days', isActive: true },
  { _id: 'da-aswan', name: 'Aswan', cost: 15, deliveryTime: '7-10 days', isActive: false },
  { _id: 'da-luxor', name: 'Luxor', cost: 12, deliveryTime: '5-7 days', isActive: false },
  { _id: 'da-port-said', name: 'Port Said', cost: 8, deliveryTime: '3-5 days', isActive: false },
  { _id: 'da-suez', name: 'Suez', cost: 8, deliveryTime: '3-5 days', isActive: false },
];

export const shippingStats = {
  activeMethods: shippingMethods.filter((m) => m.isActive).length,
  totalMethods: shippingMethods.length,
  deliveryAreas: deliveryAreas.length,
  ordersInTransit: 56,
};