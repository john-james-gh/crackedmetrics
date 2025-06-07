export type VitestSnapshot = {
  added: number;
  failure: boolean;
  filesAdded: number;
  filesRemoved: number;
  filesRemovedList: string[];
  filesUnmatched: number;
  filesUpdated: number;
  matched: number;
  total: number;
  unchecked: number;
  uncheckedKeysByFile: string[];
  unmatched: number;
  updated: number;
  didUpdate: boolean;
};

export type VitestAssertionResult = {
  ancestorTitles: string[];
  fullName: string;
  status: 'passed' | 'failed' | 'pending';
  title: string;
  duration: number;
  failureMessages: string[];
  meta: Record<string, unknown>;
};

export type VitestTestResult = {
  assertionResults: VitestAssertionResult[];
  startTime: number;
  endTime: number;
  status: 'passed' | 'failed' | 'pending';
  message: string;
  name: string;
};

export type VitestReport = {
  numTotalTestSuites: number;
  numPassedTestSuites: number;
  numFailedTestSuites: number;
  numPendingTestSuites: number;
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  numPendingTests: number;
  numTodoTests: number;
  snapshot: VitestSnapshot;
  startTime: number;
  success: boolean;
  testResults: VitestTestResult[];
};
