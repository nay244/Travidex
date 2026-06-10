import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useTheme } from '@/theme';
import { useEntitlement } from '../context/EntitlementProvider';

// add a benefit: copy a line
const BENEFITS = [
  'Dark theme (Travidex+ Appearance)',
  'Premium highlight-card frames',
  'More premium perks coming before launch',
];

export default function Paywall() {
  const t = useTheme();
  const router = useRouter();
  const { refresh, restore } = useEntitlement();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Purchases.getOfferings()
      .then(o => setPackages(o.current?.availablePackages ?? []))
      .catch(err => console.warn('getOfferings failed', err));
  }, []);

  async function buy(pkg: PurchasesPackage) {
    if (buying) return;
    setBuying(true);
    setError(null);
    try {
      await Purchases.purchasePackage(pkg);
      await refresh();
      router.back();
    } catch (e: any) {
      if (e?.userCancelled === true) {
        // user cancelled — treat as no-op
      } else {
        console.warn('purchasePackage failed', e);
        setError('Could not complete the purchase.');
      }
    } finally {
      setBuying(false);
    }
  }

  async function handleRestore() {
    await restore();
    await refresh();
    router.back();
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.colors.bg }}
      contentContainerStyle={{ padding: t.spacing.s7, gap: t.spacing.s5 }}
    >
      <Text style={[t.type.h1, { color: t.colors.text1 }]}>Travidex+</Text>

      {BENEFITS.map(b => (
        <Text key={b} style={[t.type.body, { color: t.colors.text2 }]}>
          {'•'} {b}
        </Text>
      ))}

      {packages.map(p => (
        <Pressable
          key={p.identifier}
          onPress={() => buy(p)}
          disabled={buying}
          style={{
            backgroundColor: t.colors.actionPrimary,
            padding: t.spacing.s5,
            borderRadius: t.radii.md,
            opacity: buying ? 0.6 : 1,
          }}
        >
          <Text
            style={[t.type.h3, { color: t.colors.textOnAccent, textAlign: 'center' }]}
          >
            {p.product.priceString}
          </Text>
        </Pressable>
      ))}

      {error ? (
        <Text style={[t.type.body, { color: t.colors.danger }]}>{error}</Text>
      ) : null}

      <View style={{ gap: t.spacing.s5 }}>
        <Pressable onPress={handleRestore}>
          <Text style={[t.type.body, { color: t.colors.info, textAlign: 'center' }]}>
            Restore purchases
          </Text>
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={[t.type.body, { color: t.colors.text2, textAlign: 'center' }]}>
            Not now
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
