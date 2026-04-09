import React, { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  View,
  ViewToken,
} from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const ITEM_WIDTH = SCREEN_WIDTH - 32

const SLIDES = [
  {
    id: '1',
    uri: 'https://new.iai-togo.tg/img/IMG_4607.jpg',
    title: 'Concours d’Entrée 2024-2025',
    subtitle: 'Lancement officiel du concours national d’entrée à l’IAI-Togo. Déposez votre dossier dès maintenant.',
  },
  {
    id: '2',
    uri: 'https://new.iai-togo.tg/img/IMG_9271111.jpg',
    title: 'Nouveaux Laboratoires',
    subtitle: 'Inauguration de nos salles multimédias équipées pour une formation pratique de haut niveau.',
  },
  {
    id: '3',
    uri: 'https://new.iai-togo.tg/img/IMG_4554.jpg',
    title: 'Remise de Parchemins',
    subtitle: 'Célébration du succès de nos étudiants. Félicitations aux nouveaux ingénieurs de travaux informatiques.',
  },
  {
    id: '4',
    uri: 'https://new.iai-togo.tg/img/IMG_4667.jpg', // Assuming logo for general info
    title: 'Portail Gestion-Edu',
    subtitle: 'Accédez à vos notes, emplois du temps et ressources pédagogiques via notre portail numérique.',
  },
]

type Slide = (typeof SLIDES)[number]

const SlideItem = ({ item }: { item: Slide }) => (
  <View style={{ width: ITEM_WIDTH, borderRadius: 16, overflow: 'hidden' }}>
    <Image
      source={{ uri: item.uri }}
      style={{ width: ITEM_WIDTH, height: 180 }}
      resizeMode="cover"
    />
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.38)',
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 16,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
        {item.title}
      </Text>
      <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }}>
        {item.subtitle}
      </Text>
    </View>
  </View>
)

export function Annoucement() {
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0)
      }
    }
  ).current

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % SLIDES.length
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      })
    }, 5000)

    return () => clearInterval(timer)
  }, [activeIndex])

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_WIDTH + 12,
    offset: (ITEM_WIDTH + 12) * index,
    index,
  })

  return (
    <View className="py-3">
      {/* Header */}
      {/* <View className="flex-row items-center justify-between px-4 mb-3">
        <Text className="text- font-bold text-black">Annonces</Text>
      </View> */}

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SlideItem item={item} />}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + 12}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        getItemLayout={getItemLayout}
      />

      {/* Dots — styles inline uniquement, pas de classes d'animation */}
      <View className="flex-row justify-center items-center mt-3" style={{ gap: 6 }}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={{
              borderRadius: 999,
              backgroundColor: index === activeIndex ? '#EAB308' : '#d1d5db',
              width: index === activeIndex ? 20 : 8,
              height: 8,
            }}
          />
        ))}
      </View>
    </View>
  )
}

