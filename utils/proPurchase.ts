const PRO_PRODUCT_ID = "pro_upgrade";

type ProductInfo = {
  productId: string;
  title?: string;
  description?: string;
  localizedPrice?: string;
};

const loadIapModule = (): any | null => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("react-native-iap");
  } catch {
    return null;
  }
};

const purchaseHasPro = (purchase: any): boolean => {
  if (!purchase) {
    return false;
  }

  if (purchase.productId === PRO_PRODUCT_ID) {
    return true;
  }

  if (Array.isArray(purchase.productIds)) {
    return purchase.productIds.includes(PRO_PRODUCT_ID);
  }

  return false;
};

const finishPurchase = async (iap: any, purchase: any) => {
  if (!iap?.finishTransaction || !purchase) {
    return;
  }

  try {
    await iap.finishTransaction({ purchase, isConsumable: false });
    return;
  } catch {}

  try {
    await iap.finishTransaction(purchase, false);
  } catch {}
};

const extractProducts = (raw: any): ProductInfo[] => {
  if (!raw) {
    return [];
  }

  if (Array.isArray(raw)) {
    return raw;
  }

  if (Array.isArray(raw.products)) {
    return raw.products;
  }

  return [];
};

export const getProProductId = () => PRO_PRODUCT_ID;

export const isIapConfigured = () => Boolean(loadIapModule());

export const initProIap = async (): Promise<void> => {
  const iap = loadIapModule();
  if (!iap?.initConnection) {
    return;
  }
  await iap.initConnection();
};

export const endProIap = async (): Promise<void> => {
  const iap = loadIapModule();
  if (!iap?.endConnection) {
    return;
  }
  await iap.endConnection();
};

export const fetchProProduct = async (): Promise<ProductInfo | null> => {
  const iap = loadIapModule();
  if (!iap?.getProducts) {
    return null;
  }

  let products: ProductInfo[] = [];

  try {
    products = extractProducts(await iap.getProducts({ skus: [PRO_PRODUCT_ID] }));
  } catch {
    products = extractProducts(await iap.getProducts([PRO_PRODUCT_ID]));
  }

  return products.find((item) => item.productId === PRO_PRODUCT_ID) ?? null;
};

export const restoreProPurchase = async (): Promise<boolean> => {
  const iap = loadIapModule();
  if (!iap?.getAvailablePurchases) {
    return false;
  }

  const purchases = await iap.getAvailablePurchases();
  return Array.isArray(purchases) && purchases.some(purchaseHasPro);
};

export const purchasePro = async (): Promise<boolean> => {
  const iap = loadIapModule();
  if (!iap?.requestPurchase) {
    return false;
  }

  let purchase: any = null;

  try {
    purchase = await iap.requestPurchase({
      request: {
        android: { skus: [PRO_PRODUCT_ID] },
        ios: { sku: PRO_PRODUCT_ID },
      },
      type: "in-app",
    });
  } catch {
    try {
      purchase = await iap.requestPurchase({ sku: PRO_PRODUCT_ID });
    } catch {
      purchase = await iap.requestPurchase(PRO_PRODUCT_ID);
    }
  }

  if (Array.isArray(purchase)) {
    purchase = purchase[0];
  } else if (Array.isArray(purchase?.purchases)) {
    purchase = purchase.purchases[0];
  }

  const isProPurchase = purchaseHasPro(purchase);
  if (isProPurchase) {
    await finishPurchase(iap, purchase);
  }

  return isProPurchase;
};
