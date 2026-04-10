import React, { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  View,
  ViewToken,
  ActivityIndicator,
} from 'react-native'
import { announcementService } from '@/services/dataService'
import type { Announcement } from '@/services/announcement/announcementService'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const ITEM_WIDTH = SCREEN_WIDTH - 32

// Fallback slides if no announcements from API
const FALLBACK_SLIDES = [
  {
    id: 'fallback-1',
    title: 'Bienvenue sur IAI DOCS',
    subtitle: 'Votre plateforme d\'entraînement aux examens avec correction IA',
    image: require('@/assets/images/mat.jpg'),
  },
  {
    id: 'fallback-2',
    title: 'Préparez vos examens',
    subtitle: 'Accédez à des centaines d\'épreuves corrigées par l\'IA',
    image: require('@/assets/images/mat.jpg'),
  },
]

type Slide = {
  id: string
  title: string
  subtitle: string
  image?: { uri: string } | number
  isImageUri?: boolean
}

const SlideItem = ({ item }: { item: Slide }) => (
  <View style={{ width: ITEM_WIDTH, borderRadius: 16, overflow: 'hidden' }}>
    {typeof item.image === 'number' ? (
      <Image
        source={item.image}
        style={{ width: ITEM_WIDTH, height: 180 }}
        resizeMode="cover"
      />
    ) : item.image ? (
      <Image
        source={item.image}
        style={{ width: ITEM_WIDTH, height: 180 }}
        resizeMode="cover"
      />
    ) : (
      <View style={{ width: ITEM_WIDTH, height: 180, backgroundColor: '#1e293b' }} />
    )}
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
      <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }} numberOfLines={2}>
        {item.subtitle}
      </Text>
    </View>
  </View>
)

export function Annoucement() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES)
  const [loading, setLoading] = useState(true)
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const announcements = await announcementService.getAll()
        if (announcements.length > 0) {
          const apiSlides: Slide[] = announcements.map((a: Announcement) => ({
            id: a.id,
            title: a.title,
            subtitle: a.content,
          }))
          setSlides(apiSlides)
        }
      } catch (error) {
        console.error('[Announcement] Error fetching:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0)
      }
    }
  ).current

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % slides.length
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      })
    }, 5000)

    return () => clearInterval(timer)
  }, [activeIndex, slides.length])

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_WIDTH + 12,
    offset: (ITEM_WIDTH + 12) * index,
    index,
  })

  if (loading) {
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#EAB308" />
      </View>
    )
  }

  if (slides.length === 0) {
    return null
  }

  return (
    <View className="py-3">
      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={slides}
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

      {/* Dots */}
      <View className="flex-row justify-center items-center mt-3" style={{ gap: 6 }}>
        {slides.map((_, index) => (
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

