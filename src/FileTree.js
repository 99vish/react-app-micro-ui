import React from 'react';

const FileTree = ({ data }) => {
  const renderTree = (node) => {
    if (typeof node === 'string') {
      return <li>{node}</li>;
    }

    return Object.keys(node).map((key) => (
      <li key={key}>
        <span>{key}</span>
        {node[key] && (
          <ul>{renderTree(node[key])}</ul>
        )}
      </li>
    ));
  };

  return (
    <ul>
      {renderTree(data)}
    </ul>
  );
};

export default FileTree;
