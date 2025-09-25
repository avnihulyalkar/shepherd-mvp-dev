"use client";

import React from "react";
import PropTypes from "prop-types";

export function CardTitle({ children, className = "" }) {
  return (
    <h2 className={`text-lg font-semibold text-white mb-1 ${className}`}>
      {children}
    </h2>
  );
}

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-md text-secondary mb-6 ${className}`}>{children}</p>
  );
}

CardDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-surface border border-gray-border rounded-lg shadow-md p-6 ${className}`}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
