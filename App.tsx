/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import * as Ably from 'ably/promises';
import {ABLY_KEY} from '@env';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  React.useEffect(() => {
    console.log('Hello World, from React Native!');

    const key = ABLY_KEY;

    if (key === undefined || key.length === 0) {
      throw Error(
        'ABLY_KEY not set in .env file. See README for instructions.',
      );
    }

    const realtime = new Ably.Realtime({key, log: {level: 4}});

    realtime.connection.on(stateChange => {
      console.log('Connection event state change: ', stateChange);
    });

    const channel = realtime.channels.get('someChannel');

    channel
      .attach()
      .then(() => {
        console.log('Attached to channel');

        channel.subscribe(message => {
          console.log('Got message from Ably: ', message);
        });

        channel.on('attached', stateChange => {
          console.log(
            'Channel attached event listener state change: ',
            stateChange,
          );
          if (!stateChange.resumed) {
            channel.history({untilAttach: true}).then(paginatedResult => {
              console.log(
                'Fetched missed messages from history (with untilAttach): ',
                paginatedResult.items,
              );
            });
            channel.history().then(paginatedResult => {
              console.log(
                'Fetched missed messages from history (without untilAttach): ',
                paginatedResult.items,
              );
            });
          }
        });

        return channel.publish('someName', {foo: 'bar'});
      })
      .then(() => console.log('Published to Ably'))
      .catch(error => console.log('Caught error: ', error));
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
