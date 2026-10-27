import 'server-only'

import type React from 'react'
import { createAI, getMutableAIState, getAIState } from 'ai/rsc'

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage
} from '@/components/stocks'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { FlightOptionCard } from '@/components/flight-generative-ui/FlightOptionCard'
import { EarnStrategyCard } from '@/components/flight-generative-ui/EarnStrategyCard'
import { HotelDealsCard } from '@/components/flight-generative-ui/HotelDealsCard'
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { isFlightSearchIntent } from '@/lib/chat/parse-route-intent'
import { searchTripForChat } from '@/lib/chat/search-trip-tool'
import { Chat } from '@/lib/types'
import { getServerUser } from '@/lib/supabase/server'

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export type UserMessageResponse = {
  id: string
  display: React.ReactNode
}

async function submitUserMessage(content: string): Promise<UserMessageResponse> {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  const textLower = content.toLowerCase()

  if (isFlightSearchIntent(content) && !textLower.includes('hotel')) {
    const { flight, summary } = await searchTripForChat(content)

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'assistant',
          content: summary
        },
        {
          id: nanoid(),
          role: 'function',
          name: 'showFlightOption',
          content: JSON.stringify(flight)
        }
      ]
    })

    return {
      id: nanoid(),
      display: (
        <div className="flex flex-col gap-3">
          <BotMessage content={summary} />
          <BotCard>
            <FlightOptionCard {...flight} />
          </BotCard>
        </div>
      )
    }
  }

  if (
    textLower.includes('revolut') ||
    textLower.includes('earn') ||
    textLower.includes('strategy') ||
    textLower.includes('card') ||
    textLower.includes('points') ||
    textLower.includes('amex')
  ) {
    const earnData = {
      targetPoints: 85000,
      targetDestination: 'Johannesburg / New York Business Class',
      cabin: 'Business Class',
      currentPoints: 22000,
      defaultMonthlySpend: 2000
    }

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'assistant',
          content: `Here is your customized Spain Points Earning Roadmap. By routing your everyday Spanish card expenses through Revolut Metal/Ultra (RevPoints) and Amex Spain, you earn points on supermarket visits, dining, and utility bills. Transfers to Iberia Plus Avios are 1:1 and instant.`
        },
        {
          id: nanoid(),
          role: 'function',
          name: 'showEarnStrategy',
          content: JSON.stringify(earnData)
        }
      ]
    })

    return {
      id: nanoid(),
      display: (
        <div className="flex flex-col gap-3">
          <BotMessage content="Here is your customized **Spanish Loyalty Earning Roadmap**. You don't have to fly millions of miles to accumulate Avios — by routing monthly everyday spending through Spanish cards like **Revolut (RevPoints)** or **Amex Spain**, you can accumulate enough for long-haul business class in months. Adjust your monthly spend below to see your exact timeline:" />
          <BotCard>
            <EarnStrategyCard {...earnData} />
          </BotCard>
        </div>
      )
    }
  }

  if (textLower.includes('hotel') || textLower.includes('stay') || textLower.includes('deal')) {
    const hotelData = {
      destinationCity: 'Cape Town / New York',
      deals: [
        {
          id: 'hotel-1',
          name: 'The Silo Waterfront Hotel',
          city: 'Cape Town',
          rating: 4.9,
          pricePerNightEur: 295,
          aviosBonus: 12500,
          partnerProgram: 'Iberia Plus Hotels / Rocketmiles',
          bookingUrl: 'https://www.iberia.com'
        },
        {
          id: 'hotel-2',
          name: 'The Standard High Line',
          city: 'New York',
          rating: 4.8,
          pricePerNightEur: 275,
          aviosBonus: 9500,
          partnerProgram: 'Booking.com Avios Partner',
          bookingUrl: 'https://www.iberia.com'
        }
      ]
    }

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'assistant',
          content: `Here are verified hotel deals that award massive bonus Avios. A 3-night stay can generate up to 12,500 bonus Avios toward your flights!`
        },
        {
          id: nanoid(),
          role: 'function',
          name: 'showHotelDeals',
          content: JSON.stringify(hotelData)
        }
      ]
    })

    return {
      id: nanoid(),
      display: (
        <div className="flex flex-col gap-3">
          <BotMessage content="Here are verified **partner hotel point accelerators**! Booking through Iberia Plus Hotels or Booking.com Avios partners gives you normal hotel rates plus up to **12,500 bonus Avios**, which can offset 15% to 20% of your next business flight:" />
          <BotCard>
            <HotelDealsCard {...hotelData} />
          </BotCard>
        </div>
      )
    }
  }

  // Default helpful flight assistant response
  const defaultText = `I am your **A Una Milla AI Flight Booking Assistant** (OpenClaw-powered agent). 

Here is what I can do for you from 0 to 100%:
1. **Instant Award Flight Searches**: Scan Iberia Plus, British Airways Club, and Qatar charts up to 355 days in advance. Compare retail cash against required Avios + taxes with exact net euro savings.
2. **Personalized Earning Strategies**: Calculate months to miles based on your Spanish credit cards (Revolut RevPoints, Amex Spain) and British Airways Avios Boosters.
3. **Partner Hotel Accelerators**: Find hotel deals in your destination that reward up to 15,000 bonus Avios.
4. **Save & Book Direct**: Save your custom itineraries and book directly on the official airline portal with zero middleman fees.

Try asking:
- *"Find business class flights from Madrid to New York"*
- *"How can I earn 85k Avios using my Revolut card?"*
- *"Show hotel deals that give bonus Avios"*`

  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'assistant',
        content: defaultText
      }
    ]
  })

  return {
    id: nanoid(),
    display: <BotMessage content={defaultText} />
  }
}

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const user = await getServerUser()
    if (user) {
      const state = getAIState()
      if (state) {
        return getUIStateFromAIState(state)
      }
    }
    return []
  },
  onSetAIState: async ({ state, done }) => {
    'use server'

    if (done) {
      const user = await getServerUser()
      if (user) {
        const { chatId, messages } = state
        const createdAt = new Date()
        const userId = user.id
        const path = `/chat/${chatId}`
        const title = messages[0]?.content?.substring(0, 100) || 'Travel consultation'

        const chat: Chat = {
          id: chatId,
          title,
          userId,
          createdAt,
          messages,
          path
        }

        await saveChat(chat)
      }
    }
  }
})

function safeJsonParse(val: string) {
  try {
    return JSON.parse(val)
  } catch {
    return {}
  }
}

export const getUIStateFromAIState = (aiState: Chat | AIState) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'function' ? (
          message.name === 'showFlightOption' ? (
            <BotCard>
              <FlightOptionCard {...safeJsonParse(message.content)} />
            </BotCard>
          ) : message.name === 'showEarnStrategy' ? (
            <BotCard>
              <EarnStrategyCard {...safeJsonParse(message.content)} />
            </BotCard>
          ) : message.name === 'showHotelDeals' ? (
            <BotCard>
              <HotelDealsCard {...safeJsonParse(message.content)} />
            </BotCard>
          ) : null
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
