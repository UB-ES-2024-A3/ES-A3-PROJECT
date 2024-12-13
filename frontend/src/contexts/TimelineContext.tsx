import { createContext, useContext, useState } from 'react';

type TimelineState = {
  page: 'book' | 'search' | 'user' | 'list_profile';
  data: string ;
};

type TimelineContextType = {
    timelineState: TimelineState;
    setTimelineState: React.Dispatch<React.SetStateAction<TimelineState>>;
};

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timelineState, setTimelineState] = useState<TimelineState>({ page: 'search', data: '' });

  return (
    <TimelineContext.Provider value={{ timelineState, setTimelineState }}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimelineContext = () => {
  const context = useContext(TimelineContext);
  if (!context) throw new Error('useTimelineContext must be used within a TimelineProvider');
  return context;
};
