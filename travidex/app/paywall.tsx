import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useTheme } from '@/theme';
import { useEntitlement } from '../context/EntitlementProvider';
import { Screen } from '../components/Screen';

// add a benefit: copy a line
const BENEFITS = [
  'Dark theme (Travidex+ Appearance)',
  'Premium highlight-card frames',
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
    <Screen>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: t.spacing.s7, gap: t.spacing.s5 }}
      >
        {/* Header */}
        <Text style={[t.type.h1, { color: t.colors.amber }]}>Travidex+</Text>

        {/* Benefits — green check discs */}
        <View style={{ gap: t.spacing.s3 }}>
          {BENEFITS.map(b => (
            <View key={b} style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing.s4 }}>
              <View style={{
                width: 22, height: 22, borderRadius: 11,
                backgroundColor: t.colors.green,
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Ionicons name="checkmark" size={13} color={t.colors.textOnAccent} />
              </View>
              <Text style={[t.type.body, { color: t.colors.text2, flex: 1 }]}>{b}</Text>
            </View>
          ))}
        </View>

        {/* Package buttons */}
        {packages.map(p => (
          <Pressable
            key={p.identifier}
            onPress={() => buy(p)}
            disabled={buying}
            style={({ pressed }) => ({
              backgroundColor: t.colors.actionPrimary,
              padding: t.spacing.s5,
              borderRadius: t.radii.lg,
              alignItems: 'center',
              opacity: buying || pressed ? 0.6 : 1,
            })}
          >
            <Text style={[t.type.h3, { color: t.colors.textOnAccent }]}>
              {p.product.priceString}
            </Text>
            <Text style={[t.type.label, { color: t.colors.textOnAccent, opacity: 0.8, marginTop: 2 }]}>
              per month
            </Text>
          </Pressable>
        ))}

        {error ? (
          <Text style={[t.type.body, { color: t.colors.danger }]}>{error}</Text>
        ) : null}

        {/* Footer links */}
        <View style={{ gap: t.spacing.s4 }}>
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
    </Screen>
  );
}
