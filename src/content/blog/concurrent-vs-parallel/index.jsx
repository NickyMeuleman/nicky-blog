import React from "react";

const DemoBase = ({ children }) => {
  return (
    <div className="group relative overflow-hidden">
      <div className="line absolute left-0 h-full w-[10px] -translate-x-full bg-primary opacity-30 transition-[left] duration-[4s] ease-linear group-hover:left-full group-hover:translate-x-full" />
      {children}
    </div>
  );
};

const Core = ({ children }) => {
  return (
    <React.Fragment>
      <p className="relative m-0 bg-background p-0 font-bold uppercase tracking-wide text-mutedTextBg">
        Core
      </p>
      <div className="core border-4 border-mutedTextBg/20 p-1">{children}</div>
    </React.Fragment>
  );
};

const Thread = ({ children }) => {
  return (
    <React.Fragment>
      <p className="relative m-0 p-0 font-bold uppercase tracking-wide text-mutedPrimary">
        Thread
      </p>
      <div className="thread relative flex gap-1 border-4 border-mutedPrimary/20 p-1 text-center">
        {children}
      </div>
    </React.Fragment>
  );
};

const Sequential = () => {
  return (
    <DemoBase>
      <Core>
        <Thread>
          <div className="flex-1 border-2 border-black/30">TASK 1</div>
          <div className="flex-1 border-2 border-black/30">TASK 2</div>
          <div className="flex-1 border-2 border-black/30">TASK 3</div>
        </Thread>
      </Core>
    </DemoBase>
  );
};

const Concurrent = () => {
  return (
    <DemoBase>
      <Core>
        <Thread>
          <div className="flex-1 border-2 border-black/30">TASK 1</div>
          <div className="flex-1 border-2 border-black/30" />
          <div className="flex-1 border-2 border-black/30">TASK 3</div>
        </Thread>
        <Thread>
          <div className="flex-1 border-2 border-black/30" />
          <div className="flex-1 border-2 border-black/30">TASK 2</div>
          <div className="flex-1 border-2 border-black/30" />
        </Thread>
      </Core>
    </DemoBase>
  );
};

const Parallel = () => (
  <DemoBase>
    <Core>
      <Thread>
        <div className="flex-1 border-2 border-black/30">TASK 1</div>
        <div className="flex-1 border-2 border-black/30">TASK 2</div>
        <div className="flex-1 border-2 border-black/30">TASK 3</div>
      </Thread>
    </Core>
    <Core>
      <Thread>
        <div className="flex-1 border-2 border-black/30">TASK 4</div>
        <div className="flex-1 border-2 border-black/30">TASK 5</div>
        <div className="flex-1 border-2 border-black/30">TASK 6</div>
      </Thread>
    </Core>
  </DemoBase>
);

const Both = () => (
  <DemoBase>
    <Core>
      <Thread>
        <div className="flex-1 border-2 border-black/30">TASK 1</div>
        <div className="flex-1 border-2 border-black/30">TASK 2</div>
        <div className="flex-1 border-2 border-black/30" />
      </Thread>
      <Thread>
        <div className="flex-1 border-2 border-black/30" />
        <div className="flex-1 border-2 border-black/30" />
        <div className="flex-1 border-2 border-black/30">TASK 3</div>
      </Thread>
    </Core>
    <Core>
      <Thread>
        <div className="flex-1 border-2 border-black/30">TASK 4</div>
        <div className="flex-1 border-2 border-black/30" />
        <div className="flex-1 border-2 border-black/30">TASK 6</div>
      </Thread>
      <Thread>
        <div className="flex-1 border-2 border-black/30" />
        <div className="flex-1 border-2 border-black/30">TASK 5</div>
        <div className="flex-1 border-2 border-black/30" />
      </Thread>
    </Core>
  </DemoBase>
);

export { Sequential, Concurrent, Parallel, Both };
