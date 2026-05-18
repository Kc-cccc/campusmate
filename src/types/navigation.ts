import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Tasks: undefined;
  Study: undefined;
  Analytics: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  AddTask: { taskId?: string } | undefined;
  TaskDetail: { taskId: string };
  LocationReminder: undefined;
  HelpPrivacy: undefined;
};
