'use client';

import React from 'react';
import {{ (index .Collections 0).Name }}Home from '../{{- (index .Collections 0).JSON -}}/home';

const Home = () => {

  return <{{- (index .Collections 0).Name -}}Home />
};

export default Home;
