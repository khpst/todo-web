export const TODOS_BY_USER_ID_QUERY = `
  query GetTodosByUserId($userId: Int4!) {
    todos(where: {userId: {_eq: $userId}}) {
      id
      title
      description
      priority
      status
      userId
    }
  }
`;

export const LOGIN_QUERY = `
  query GetUser($username: Varchar!, $password: Varchar!) {
    users(where: { username: { _eq: $username }, password: { _eq: $password } }) {
      id
      username
    }
  }
`;

export const CREATE_TODO_MUTATION = `
  mutation CreateTodo($title: Varchar!, $description: Text!, $priority: TodoPriority!, $userId: Int4!) {
    insertTodos(objects: [{
      title: $title,
      description: $description,
      priority: $priority,
      status: "pending",
      userId: $userId
    }]) {
      returning {
        id
        title
        description
        priority
        status
        userId
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_TODO_MUTATION = `
  mutation UpdateTodo($id: Int4!, $title: UpdateColumnTodosTitleInput!, $description: UpdateColumnTodosDescriptionInput!, $priority: UpdateColumnTodosPriorityInput!, $status: UpdateColumnTodosStatusInput!, $preCheck: TodosBoolExp) {
    updateTodosById(
      keyId: $id,
      preCheck: $preCheck,
      updateColumns: {
        title: $title,
        description: $description,
        priority: $priority,
        status: $status
      }
    ) {
      returning {
        id
        title
        description
        priority
        status
        userId
      }
    }
  }
`;

export const DELETE_TODO_MUTATION = `
  mutation DeleteTodo($keyId: Int4!, $preCheck: TodosBoolExp) {
    deleteTodosById(keyId: $keyId, preCheck: $preCheck) {
      affectedRows
      returning {
        id
        title
        description
        priority
        status
        userId
      }
    }
  }
`;

export const USER_BY_ID_QUERY = `
  query GetUserById($id: Int4!) {
    usersById(id: $id) {
      id
      displayName
      username
    }
  }
`;
