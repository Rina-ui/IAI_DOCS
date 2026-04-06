import CourseCard from "@/app/components/CourseCard";
import DocumentItem from "@/app/components/DocumentItem";
import GreetingSection from "@/app/components/GreetingSection";
import Header from "@/app/components/Header";
import SectionHeader from "@/app/components/SectionHeader";
import StatsRow from "@/app/components/StatsRow";
import SummaryCard from "@/app/components/SummaryCard";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const courses = [
    {
      id: 1,
      title: "Fondements de la Robotique",
      category: "INFORMATIQUE",
      image: require("@/assets/images/test.png"),
    },
    {
      id: 2,
      title: "Analyse de Données Avancée",
      category: "DATA SCIENCE",
      image: require("@/assets/images/test.png"),
    },
  ];

  const documents = [
    {
      id: 1,
      title: "Ethique_IA_Notes.pdf",
      time: "Modifié il y a 2 heures",
      type: "pdf" as const,
    },
    {
      id: 2,
      title: "Recherche_Algorithmique.docx",
      time: "Modifié hier",
      type: "docx" as const,
    },
    {
      id: 3,
      title: "Dataset_Validation.csv",
      time: "Modifié il y a 3 jours",
      type: "csv" as const,
    },
  ];

  return (
    <SafeAreaView >
      <ScrollView >
        <Header />
        <GreetingSection userName="Maxime" />

        <SummaryCard
          title="Synthèse du jour"
          description="Vous avez progressé de 15% sur le module 'Intelligence Artificielle & Éthique'. 3 nouveaux concepts clés ont été extraits de vos lectures."
        />

        <StatsRow
          stats={[
            {
              number: "12",
              label: "Documents curés",
              backgroundColor: "bg-tertiary",
            },
            {
              number: "4.5h",
              label: "Session active",
              backgroundColor: "bg-neutral",
            },
          ]}
        />

        <SectionHeader title="Cours récents" action="Voir tout" />
        <View className="flex-row gap-3 px-6 mb-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              category={course.category}
              image={course.image}
            />
          ))}
        </View>

        <SectionHeader title="Documents consultés" />
        <View className="bg-white rounded-xl mx-6 mb-6 overflow-hidden border border-neutral">
          {documents.map((doc) => (
            <DocumentItem
              key={doc.id}
              title={doc.title}
              modifiedTime={doc.time}
              type={doc.type}
            />
          ))}
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
