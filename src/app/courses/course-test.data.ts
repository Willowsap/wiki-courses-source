import { CourseStub, Topic } from "./course.model";
import { Commit } from "./editing/advanced/commit.model";

export const COURSE_STUB_TEST_DATA: Array<CourseStub> = [
  { title: "firstCourse", description: "d1"},
  { title: "secondCourse", description: "d2"},
  { title: "thirdCourse", description: "d3"},
  { title: "fourthCourse", description: "d4"},
  { title: "fifthCourse", description: "d5"},
];

export const COURSE_DATA: Array<{courseTitle: string, topics: Array<Topic>}> = [
  { 
    courseTitle: "firstCourse", topics: [
      { title: "c1t1", contents: "c1t1description"},
      { title: "c1t2", contents: "c1t2description"},
      { title: "c1t3", contents: "c1t3description"},
      { title: "c1t4", contents: "c1t4description"},
    ]
  },{ 
    courseTitle: "secondCourse", topics: [
      { title: "c2t1", contents: "c2t1description"},
      { title: "c2t2", contents: "c2t2description"},
      { title: "c2t3", contents: "c2t3description"},
      { title: "c2t4", contents: "c2t4description"},
    ]
  },{ 
    courseTitle: "thirdCourse", topics: [
      { title: "c3t1", contents: "c3t1description"},
      { title: "c3t2", contents: "c3t2description"},
      { title: "c3t3", contents: "c3t3description"},
      { title: "c3t4", contents: "c3t4description"},
    ]
  },{ 
    courseTitle: "fourthCourse", topics: [
      { title: "c4t1", contents: "c4t1description"},
      { title: "c4t2", contents: "c4t2description"},
      { title: "c4t3", contents: "c4t3description"},
      { title: "c4t4", contents: "c4t4description"},
    ]
  },{ 
    courseTitle: "fifthCourse", topics: [
      { title: "c5t1", contents: "c5t1description"},
      { title: "c5t2", contents: "c5t2description"},
      { title: "c5t3", contents: "c5t3description"},
      { title: "c5t4", contents: "c5t4description"},
    ]
  },
];

export const COMMIT_TEST_DATA: Array<Commit> = [
  {
    oid: "1",
    commit: {
      message: "m",
      parent: ["parentArray"],
      tree: "t",
      author: [{a: "authorObject"}],
      committer: {
        email: "e",
        name: "n",
        timestamp: 0,
        timezoneOffset: 0,
      }
    },
    payload: "p"
  },
  {
    oid: "2",
    commit: {
      message: "m",
      parent: ["parentArray"],
      tree: "t",
      author: [{a: "authorObject"}],
      committer: {
        email: "e",
        name: "n",
        timestamp: 0,
        timezoneOffset: 0,
      }
    },
    payload: "p"
  },
]