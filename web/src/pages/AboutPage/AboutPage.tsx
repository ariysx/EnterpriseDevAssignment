export const AboutPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mt-10">
        General Description of How the Application
        Works
      </h1>
      <p>
        The application is a web-based catalog
        system designed to showcase a variety of
        items. Users can view, search, and filter
        through catalog items to find specific
        entries. The application supports
        creating, editing, and deleting catalog
        entries, providing a dynamic and
        interactive experience. The frontend,
        built with React, offers a responsive and
        intuitive user interface, while the
        backend, powered by Node.js, handles data
        management and API requests.
      </p>

      <h1 className="text-4xl font-bold mt-10">
        Technologies Used
      </h1>
      <ul className="list-disc list-inside mt-5">
        <li>
          React: Used for building the frontend.
          It's a popular JavaScript library for
          creating user interfaces, particularly
          single-page applications.
        </li>
        <li>
          Node.js: Serves as the runtime
          environment for the backend. It's used
          for executing JavaScript code
          server-side, enabling the development of
          scalable network applications.
        </li>
        <li>
          MongoDB: A NoSQL database used to store
          and manage the application's data. It
          provides a flexible and scalable
          solution for handling large volumes of
          data.
        </li>
        <li>
          Express: A web application framework for
          Node.js, used to build the API
          endpoints. It simplifies the server-side
          logic through middleware and routing.
        </li>
        <li>
          npm: Stands for Node Package Manager,
          used to manage the project's
          dependencies.
        </li>
        <li>
          Tailwind CSS: A utility-first CSS
          framework used for styling the
          application. It provides a set of
          pre-built components and utilities for
          rapid development.
        </li>
        <li>
          DaisyUI: A Tailwind CSS component
          library that extends the framework with
          additional components and utilities.
        </li>
        <li>
          React Router: A routing library for
          React applications. It enables
          navigation and URL handling within the
          application.
        </li>
        <li>
          Axios: A promise-based HTTP client for
          making API requests. It simplifies the
          process of sending asynchronous requests
          and handling responses.
        </li>
        <li>
          React Icons: A collection of popular
          icons as React components. It provides
          easy access to icons for use in
          applications.
        </li>
        <li>
          React Toastify: A notification library
          for React applications. It provides
          customizable toast messages for
          displaying alerts and feedback to users.
        </li>
        <li>
          Mongoose: An Object Data Modeling (ODM)
          library for MongoDB and Node.js. It
          provides a straightforward schema-based
          solution for modeling application data.
        </li>
      </ul>

      <h1 className="text-4xl font-bold mt-10">
        Weaknesses of the Application
      </h1>
      <ul className="list-disc list-inside mt-5">
        <li>
          Scalability: Given the current
          architecture, the application might face
          scalability issues as the user base and
          data volume grow. The monolithic
          structure could lead to bottlenecks.
        </li>
        <li>
          Security: The application might be
          vulnerable to common web security risks,
          such as SQL injection or cross-site
          scripting (XSS), if not properly
          handled.
        </li>
        <li>
          Performance: The use of a single-page
          application (SPA) framework like React
          can lead to performance issues on
          low-powered devices due to the
          client-side rendering of content.
        </li>
      </ul>

      <h1 className="text-4xl font-bold mt-10">
        Alternatives and Future Improvements
      </h1>
      <ul className="list-disc list-inside mt-5">
        <li>
          Microservices Architecture: Instead of a
          monolithic architecture, using
          microservices could improve scalability
          and maintainability. Each service could
          be independently scaled and updated.
        </li>
        <li>
          Next.js or Gatsby: For the frontend,
          considering Next.js or Gatsby could
          enhance SEO and performance through
          server-side rendering and static site
          generation.
        </li>
        <li>
          GraphQL: Replacing REST API with GraphQL
          could provide more efficient data
          loading, reducing the number of requests
          and the amount of data transferred over
          the network.
        </li>
        <li>
          Docker and Kubernetes: For deployment,
          using Docker for containerization and
          Kubernetes for orchestration could
          significantly improve the application's
          scalability and deployment process.
        </li>
      </ul>
    </div>
  )
}
