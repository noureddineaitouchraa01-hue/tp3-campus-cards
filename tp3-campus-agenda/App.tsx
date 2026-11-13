
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

// 1. TypeScript type
type Evenement = {
  id: string;
  titre: string;
  categorie: string;
  capacite: number;
  inscrits: number;
};

// 2. Données
const evenements: Evenement[] = [{ id: 'E01', titre: 'Atelier React', categorie: 'Atelier', capacite: 25, inscrits: 25 },
  { id: 'E02', titre: 'Conférence IA', categorie: 'Conférence', capacite: 70, inscrits: 52 },
  { id: 'E03', titre: 'Sécurité mobile', categorie: 'Atelier', capacite: 20, inscrits: 17 },
  { id: 'E04', titre: 'Design UI', categorie: 'Atelier', capacite: 18, inscrits: 9 },
  { id: 'E05', titre: 'Forum projets', categorie: 'Rencontre', capacite: 50, inscrits: 49 },
  { id: 'E06', titre: 'Découverte Git', categorie: 'Atelier', capacite: 24, inscrits: 24 },
];
  

// 3. Mode d'affichage
const mode: 'tous' | 'ateliers' = 'tous';

// 4. Fonctions de calcul
function placesRestantes(e: Evenement): number {
  return Math.max(0, e.capacite - e.inscrits);
}

function statutEvenement(e: Evenement): string {
  const places = placesRestantes(e);

  if (places === 0) return 'Complet';
  if (places <= 3) return 'Presque complet';
  return 'Ouvert';
}

// 5. Indicateurs globaux
const totalEvenements = evenements.length;

const evenementsComplets = evenements.filter(
  (e) => placesRestantes(e) === 0
).length;

const evenementsDisponibles = evenements.filter(
  (e) => placesRestantes(e) > 0
).length;

const totalPlaces = evenements.reduce(
  (total, e) => total + placesRestantes(e),
  0
);

// 6. Ateliers disponibles
const ateliersDisponibles = evenements.filter(
  (e) => e.categorie === 'Atelier' && placesRestantes(e) > 0
);

// 7. Composant BadgeEtat
type BadgeEtatProps = {
  statut: string;
};

function BadgeEtat({ statut }: BadgeEtatProps) {
  let couleur = '#DCFCE7';

  if (statut === 'Complet') couleur = '#FEE2E2';
  else if (statut === 'Presque complet') couleur = '#FFEDD5';

  return (
    <View style={[styles.badge, { backgroundColor: couleur }]}>
      <Text style={styles.badgeText}>{statut}</Text>
    </View>
  );
}

// 8. Composant CarteEvenement
type CarteEvenementProps = {
  evenement: Evenement;
};

function CarteEvenement({ evenement }: CarteEvenementProps) {
  const places = placesRestantes(evenement);
  const statut = statutEvenement(evenement);

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Text style={styles.eventTitle}>{evenement.titre}</Text>
          <Text style={styles.category}>{evenement.categorie}</Text>
          <Text style={styles.places}>
            {places} {places > 1 ? 'places libres' : 'place libre'}
          </Text>
        </View>

        <BadgeEtat statut={statut} />
      </View>
    </View>
  );
}

// 9. Composant BlocStatistique
type BlocStatistiqueProps = {
  libelle: string;
  nombre: number;
};

function BlocStatistique({ libelle, nombre }: BlocStatistiqueProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{nombre}</Text>
      <Text style={styles.statLabel}>{libelle}</Text>
    </View>
  );
}

// 10. Application principale
export default function App() {
  const listeAffichee =
    mode === 'tous' ? evenements : ateliersDisponibles;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listeAffichee}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.appTitle}>CampusAgenda</Text>
              <Text style={styles.subtitle}>
                Événements du campus
              </Text>
            </View>

            <View style={styles.statsContainer}>
              <BlocStatistique
                libelle="Événements"
                nombre={totalEvenements}
              />
              <BlocStatistique
                libelle="Événements complets"
                nombre={evenementsComplets}
              />
              <BlocStatistique
                libelle="Événements disponibles"
                nombre={evenementsDisponibles}
              />
              <BlocStatistique
                libelle="Places restantes"
                nombre={totalPlaces}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {mode === 'tous'
                  ? 'Tous les événements'
                  : 'Ateliers disponibles'}
              </Text>
              <Text style={styles.counter}>
                {listeAffichee.length} événements
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <CarteEvenement evenement={item} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              Aucun événement disponible
            </Text>
            <Text style={styles.emptyText}>
              Il n'y a aucun événement à afficher pour le moment.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// 11. Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
  },
  listContent: {
    padding: 20,
    paddingBottom: 35,
  },
  header: {
    marginBottom: 25,
    marginTop: 15,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#172554',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNumber: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#172554',
    flex: 1,
  },
  counter: {
    fontSize: 12,
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 14,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  category: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 5,
  },
  places: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    maxWidth: 115,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
  },
  empty: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
});

