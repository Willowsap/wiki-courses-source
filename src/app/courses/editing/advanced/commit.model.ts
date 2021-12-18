export interface Commit {
  oid: string;
  commit: {
    message: string;
    parent: Array<string>;
    tree: string;
    author: Array<Object>;
    committer: {
      email: string,
      name: string,
      timestamp: number,
      timezoneOffset: number
    };
  };
  payload: string;
}
