/**
 * Commands
 * Inputs represented as Commands
 */
export enum Commands {
  CREATE_QUESTION = 'CREATE_QUESTION',
  UPDATE_QUESTION = 'UPDATE_QUESTION',
}

export type Command<
  Name extends string = string,
  Data extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
  name: Name;
  data: Data;
}>;

type QuestionCommandData = QuestionData & { answerOptions: AnswerOptionData[] };

export type CreateQuestionCommand = Command<
  Commands.CREATE_QUESTION,
  QuestionCommandData
>;

export type UpdateQuestionCommand = Command<
  Commands.UPDATE_QUESTION,
  QuestionCommandData
>;

export type QuestionCommand = CreateQuestionCommand | UpdateQuestionCommand;

/**
 * The decided actions
 * Outputs represented as I/O actions
 */
export enum Actions {
  INSERT_QUESTION = 'INSERT_QUESTION',
  UPDATE_QUESTION = 'UPDATE_QUESTION',
  INSERT_ANSWER_OPTIONS = 'INSERT_ANSWER_OPTIONS',
  UPDATE_ANSWER_OPTIONS = 'UPDATE_ANSWER_OPTIONS',
  REMOVE_ANSWER_OPTIONS = 'REMOVE_ANSWER_OPTIONS',
}

export type Action<
  Name extends string = string,
  Data extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
  name: Name;
  data: Data;
}>;

export type QuestionData = {
  id: string;
  prompt: string;
  answerOptions: AnswerOptionData[];
};

export type AnswerOptionData = {
  id: string;
  answer: string;
  correct: boolean;
};

export type AnswerOptionsData = {
  questionId: string;
  answerOptions: AnswerOptionData[];
};

export type InsertQuestion = Action<Actions.INSERT_QUESTION, QuestionData>;

export type UpdateQuestion = Action<Actions.UPDATE_QUESTION, QuestionData>;

export type InsertAnswerOptions = Action<
  Actions.INSERT_ANSWER_OPTIONS,
  AnswerOptionsData
>;

export type UpdateAnswerOptions = Action<
  Actions.UPDATE_ANSWER_OPTIONS,
  AnswerOptionsData
>;

export type RemoveAnswerOptions = Action<
  Actions.REMOVE_ANSWER_OPTIONS,
  AnswerOptionsData
>;

export type QuestionAction =
  | InsertQuestion
  | UpdateQuestion
  | InsertAnswerOptions
  | UpdateAnswerOptions
  | RemoveAnswerOptions;

/**
 * The command handler type
 * it takes a command and an optional current question state
 * and returns a list of decided actions to be made
 */
export type Handle = (
  command: QuestionCommand,
  question?: Question.t
) => Action[];

/**
 * Using specifications to make a decision
 * a spec is made of a predicate function that check if a decision should be taken
 * and a factory function that returns the action with its data
 */
type Spec = {
  isSatisfiedBy: (
    updatedQuestion: Question.t,
    newQuestion: Question.t,
    addedAnswerOptions: AnswerOption.t[],
    removedAnswerOptions: AnswerOption.t[],
    updatedAnswerOptions: AnswerOption.t[]
  ) => boolean;
  action: (
    newQuestion: Question.t,
    addedAnswerOptions: AnswerOption.t[],
    removedAnswerOptions: AnswerOption.t[],
    updatedAnswerOptions: AnswerOption.t[]
  ) => QuestionAction;
};

const updateQuestionSpec: Spec = {
  isSatisfiedBy: (updatedQuestion, newQuestion) =>
    updatedQuestion.id === newQuestion.id &&
    updatedQuestion.prompt !== newQuestion.prompt,
  action: (newQuestion) => ({
    name: Actions.UPDATE_QUESTION,
    data: {
      id: newQuestion.id,
      prompt: newQuestion.prompt,
      answerOptions: newQuestion.answerOptions,
    },
  }),
};

const insertAnswerOptionsSpec: Spec = {
  isSatisfiedBy: (updatedQuestion, newQuestion, addedAnswerOptions) =>
    updatedQuestion.id === newQuestion.id && addedAnswerOptions.length > 0,
  action: (newQuestion, addedAnswerOptions) => ({
    name: Actions.INSERT_ANSWER_OPTIONS,
    data: {
      questionId: newQuestion.id,
      answerOptions: addedAnswerOptions,
    },
  }),
};

const removeAnswerOptionsSpec: Spec = {
  isSatisfiedBy: (updatedQuestion, newQuestion, ___, removedAnswerOptions) =>
    updatedQuestion.id === newQuestion.id && removedAnswerOptions.length > 0,
  action: (newQuestion, _, removedAnswerOptions) => ({
    name: Actions.REMOVE_ANSWER_OPTIONS,
    data: { questionId: newQuestion.id, answerOptions: removedAnswerOptions },
  }),
};

const updateAnswerOptionsSpec: Spec = {
  isSatisfiedBy: (
    updatedQuestion,
    newQuestion,
    ___,
    ____,
    updatedAnswerOptions
  ) => updatedQuestion.id === newQuestion.id && updatedAnswerOptions.length > 0,
  action: (newQuestion, _, __, updatedAnswerOptions) => ({
    name: Actions.UPDATE_ANSWER_OPTIONS,
    data: {
      questionId: newQuestion.id,
      answerOptions: updatedAnswerOptions,
    },
  }),
};

const specs: Spec[] = [
  updateQuestionSpec,
  insertAnswerOptionsSpec,
  removeAnswerOptionsSpec,
  updateAnswerOptionsSpec,
];

/**
 * The domain model
 */
export namespace Question {
  export type t = {
    id: QuestionId.t;
    prompt: string;
    answerOptions: AnswerOption.t[];
  };
}

export namespace QuestionId {
  export type t = string;
}

export namespace AnswerOption {
  export type t = {
    id: string;
    answer: string;
    correct: boolean;
  };
}

/**
 * Handle type implementation
 *
 * @param command
 * @param question
 * @returns Array
 */
export const handle: Handle = (
  command: QuestionCommand,
  question?: Question.t
) => {
  if (command.name === Commands.CREATE_QUESTION) {
    return handleCreateQuestion(command);
  }

  if (question) {
    return handleUpdateQuestion(command, question);
  }

  throw new Error('can not process the command');
};

/**
 * Private function to handle create question command
 * @param command
 * @returns
 */
const handleCreateQuestion = (
  command: CreateQuestionCommand
): QuestionAction[] => {
  const question: Question.t = {
    id: command.data.id as QuestionId.t,
    prompt: command.data.prompt,
    answerOptions: command.data.answerOptions,
  };

  const insertQuestionAction: InsertQuestion = {
    name: Actions.INSERT_QUESTION,
    data: {
      id: question.id,
      prompt: question.prompt,
      answerOptions: question.answerOptions,
    },
  };

  const answerOptionsData = {
    questionId: question.id,
    answerOptions: question.answerOptions,
  };
  const insertAnswerOptionsAction: InsertAnswerOptions = {
    name: Actions.INSERT_ANSWER_OPTIONS,
    data: answerOptionsData,
  };
  return [insertQuestionAction, insertAnswerOptionsAction];
};

/**
 * Private function to handle update question command
 * @param command
 * @param updatedQuestion
 * @returns Array
 */
const handleUpdateQuestion = (
  command: UpdateQuestionCommand,
  updatedQuestion: Question.t
): QuestionAction[] => {
  const newQuestion: Question.t = {
    id: command.data.id as QuestionId.t,
    prompt: command.data.prompt,
    answerOptions: command.data.answerOptions,
  };

  const oldKeys = new Set(updatedQuestion.answerOptions.map((a) => a.id));
  const newKeys = new Set(newQuestion.answerOptions.map((a) => a.id));
  const addedAnswerOptions = newQuestion.answerOptions.filter(
    (a) => !oldKeys.has(a.id)
  );
  const removedAnswerOptions = updatedQuestion.answerOptions.filter(
    (a) => !newKeys.has(a.id)
  );

  const updatedAnswerOptions = newQuestion.answerOptions.filter((newAO) => {
    const oldAO = updatedQuestion.answerOptions.find(
      (ao) => ao.id === newAO.id
    );
    return (
      oldAO &&
      (oldAO.answer !== newAO.answer || oldAO.correct !== newAO.correct)
    );
  });

  return specs.reduce((actions, spec) => {
    if (
      spec.isSatisfiedBy(
        updatedQuestion,
        newQuestion,
        addedAnswerOptions,
        removedAnswerOptions,
        updatedAnswerOptions
      )
    ) {
      actions.push(
        spec.action(
          newQuestion,
          addedAnswerOptions,
          removedAnswerOptions,
          updatedAnswerOptions
        )
      );
    }
    return actions;
  }, [] as QuestionAction[]);
};
