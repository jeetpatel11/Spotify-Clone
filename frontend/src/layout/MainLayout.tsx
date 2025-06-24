import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import React from 'react'
import { Outlet } from 'react-router-dom';
import LeftSidebar from './components/LeftSidebar';
import FreindsActivity from './components/FreindsActivity';
import AudioPlayer from './components/AudioPlayer';
import PlayBackControls from './components/PlayBackControls';

function MainLayout() {
    const isMobile=false;
  return (
    <div className='h-screen bg-black text-white flex flex-col '>
        <ResizablePanelGroup direction='horizontal' className='flex flex-1 h-full overflow-hidden p-2'>
            <AudioPlayer/>
            {/* left side  */ }

            <ResizablePanel defaultSize={20} minSize={isMobile?0:10} maxSize={30}>
                <LeftSidebar/>
            </ResizablePanel>

            <ResizableHandle className='w-2 bg-black rounded-lg transition-colors'/>
             {/* Center  */ } 
            <ResizablePanel defaultSize={isMobile?80:60}>
                <Outlet/>
            </ResizablePanel> 

            <ResizableHandle className='w-2 bg-black rounded-lg transition-colors'/>
             {/* Right side  */ }
            <ResizablePanel defaultSize={20} minSize={isMobile?0:10} maxSize={25} collapsedSize={0}>
              <FreindsActivity/>
            </ResizablePanel>
        </ResizablePanelGroup>
        <PlayBackControls/>
    </div>
  )
}

export default MainLayout
