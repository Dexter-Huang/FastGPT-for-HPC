import React, { useCallback, useMemo, useRef } from 'react';
import { Box, Flex, useTheme } from '@chakra-ui/react';
import { useSystemStore } from '@/web/common/system/useSystemStore';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { clearToken } from '@/web/support/user/auth';
import { useUserStore } from '@/web/support/user/useUserStore';
import { useConfirm } from '@/web/common/hooks/useConfirm';
import PageContainer from '@/components/PageContainer';
import SideTabs from '@/components/SideTabs';
import Tabs from '@/components/Tabs';
import UserInfo from './components/Info';
import { serviceSideProps } from '@/web/common/utils/i18n';
import { feConfigs } from '@/web/common/system/staticData';
import { useTranslation } from 'next-i18next';
import Script from 'next/script';
const OnlineDataSetMakerPage = dynamic(() => import('./components/OnlineDataSetMakerPage'));
const OnlineTuningPage = dynamic(() => import('./components/OnlineTuningPage'));

enum TabEnum {
  'info' = 'info',
  'onlineDatasetMaker' = 'onlineDatasetMaker',
  'onlineTuning' = 'onlineTuning',
  'quantization' = 'quantization',
  'loginout' = 'loginout'
}

const Tuning = ({ currentTab }: { currentTab: `${TabEnum}` }) => {
  const { t } = useTranslation();
  const { userInfo, setUserInfo } = useUserStore();

  const tabList = [
    {
      icon: 'meLight',
      label: t('tuning.DataSet Online Maker'),
      id: TabEnum.onlineDatasetMaker
    },
    {
      icon: 'apikey',
      label: t('tuning.Online Tuning'),
      id: TabEnum.onlineTuning
    }
  ];

  const { openConfirm, ConfirmModal } = useConfirm({
    content: '确认退出登录？'
  });

  const router = useRouter();
  const theme = useTheme();
  const { isPc } = useSystemStore();

  const setCurrentTab = useCallback(
    (tab: string) => {
      if (tab === TabEnum.loginout) {
        openConfirm(() => {
          setUserInfo(null);
          router.replace('/login');
        })();
      } else {
        router.replace({
          query: {
            currentTab: tab
          }
        });
      }
    },
    [openConfirm, router, setUserInfo]
  );

  return (
    <>
      <Script src="/js/qrcode.min.js" strategy="lazyOnload"></Script>
      <PageContainer>
        <Flex flexDirection={['column', 'row']} h={'100%'} pt={[4, 0]}>
          {isPc ? (
            <Flex
              flexDirection={'column'}
              p={4}
              h={'100%'}
              flex={'0 0 200px'}
              borderRight={theme.borders.base}
            >
              <SideTabs
                flex={1}
                mx={'auto'}
                mt={2}
                w={'100%'}
                list={tabList}
                activeId={currentTab}
                onChange={setCurrentTab}
              />
            </Flex>
          ) : (
            <Box mb={3}>
              <Tabs
                m={'auto'}
                size={isPc ? 'md' : 'sm'}
                list={tabList.map((item) => ({
                  id: item.id,
                  label: item.label
                }))}
                activeId={currentTab}
                onChange={setCurrentTab}
              />
            </Box>
          )}

          <Box flex={'1 0 0'} h={'100%'} pb={[4, 0]}>
            {currentTab === TabEnum.onlineDatasetMaker && <OnlineDataSetMakerPage />}
            {currentTab === TabEnum.onlineTuning && <OnlineTuningPage />}
          </Box>
        </Flex>
        <ConfirmModal />
      </PageContainer>
    </>
  );
};

export async function getServerSideProps(content: any) {
  return {
    props: {
      currentTab: content?.query?.currentTab || TabEnum.info,
      ...(await serviceSideProps(content))
    }
  };
}

export default Tuning;
